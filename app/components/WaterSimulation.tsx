"use client";

import { useRef, useMemo, useEffect, RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Water wave shaders with clean, realistic wave propagation physics
const vertexShader = `
  uniform float time;
  uniform vec2 mousePos;
  uniform vec2 mouseVelocity;
  uniform float waveStrength;
  uniform vec3 wavePositions[10];
  uniform float waveTimes[10];
  uniform vec2 waveDirections[10];
  uniform int activeWaves;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;
  
  // Improved simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Gentle ambient ocean waves
    float wave1 = snoise(uv * 1.5 + time * 0.08) * 0.08;
    float wave2 = snoise(uv * 3.0 - time * 0.05) * 0.04;
    float wave3 = snoise(uv * 6.0 + time * 0.12) * 0.02;
    
    float elevation = (wave1 + wave2 + wave3);
    
    // Realistic wave propagation from mouse interaction
    for(int i = 0; i < 10; i++) {
      if(i >= activeWaves) break;
      
      vec2 wavePos = wavePositions[i].xy;
      float waveAge = time - waveTimes[i];
      vec2 waveDir = waveDirections[i];
      
      if(waveAge < 2.5) {
        vec2 toPoint = uv - wavePos;
        float dist = length(toPoint);
        
        float waveSpeed = 0.35;
        float waveFront = waveAge * waveSpeed;
        
        // Directional wave
        vec2 toPointNorm = length(toPoint) > 0.0 ? normalize(toPoint) : vec2(0.0);
        float directionality = max(0.0, dot(toPointNorm, waveDir)) * 0.6 + 0.4;
        
        float baseAmp = 0.12 * directionality * waveStrength;
        float distFromFront = abs(dist - waveFront);
        
        // Clean wave packet
        if(distFromFront < 0.12) {
          float envelope = (1.0 - distFromFront / 0.12) * (1.0 - waveAge / 2.5);
          float frequency = 12.0;
          float phase = dist * frequency - time * 6.0;
          
          elevation += sin(phase) * envelope * baseAmp;
        }
      }
    }
    
    pos.z = elevation;
    vElevation = elevation;
    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;
  
  // Fresnel effect for realistic water
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - max(dot(viewDir, normal), 0.0), power);
  }
  
  void main() {
    // Photorealistic ocean colors
    vec3 deepOcean = vec3(0.0, 0.12, 0.28);
    vec3 shallowOcean = vec3(0.0, 0.32, 0.55);
    vec3 surfaceHighlight = vec3(0.05, 0.45, 0.72);
    
    // Depth-based color gradient
    float depth = smoothstep(-0.15, 0.15, vElevation);
    vec3 waterColor = mix(deepOcean, shallowOcean, depth);
    waterColor = mix(waterColor, surfaceHighlight, smoothstep(0.08, 0.18, vElevation));
    
    // Calculate normal from world position for accurate reflections
    vec3 fdx = dFdx(vWorldPos);
    vec3 fdy = dFdy(vWorldPos);
    vec3 normal = normalize(cross(fdx, fdy));
    
    // View direction for fresnel
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    
    // Fresnel effect - water is more reflective at glancing angles
    float fresnelFactor = fresnel(viewDir, normal, 2.5);
    
    // Reflection color (sky reflection)
    vec3 skyReflection = vec3(0.1, 0.15, 0.25);
    waterColor = mix(waterColor, skyReflection, fresnelFactor * 0.6);
    
    // Specular highlights from directional light
    vec3 lightDir = normalize(vec3(0.5, 0.9, 0.4));
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 128.0);
    waterColor += vec3(specular * 0.8);
    
    // Subtle foam on wave peaks
    float foam = smoothstep(0.12, 0.2, vElevation);
    vec3 foamColor = vec3(0.85, 0.92, 0.98);
    waterColor = mix(waterColor, foamColor, foam * 0.3);
    
    // Caustic-like shimmer
    float caustic1 = sin(vUv.x * 18.0 + time * 0.8) * cos(vUv.y * 18.0 - time * 0.6);
    float caustic2 = sin(vUv.x * 25.0 - time * 1.2) * cos(vUv.y * 25.0 + time * 0.9);
    float caustic = (caustic1 + caustic2) * 0.5;
    caustic = smoothstep(0.5, 1.0, caustic) * 0.08;
    
    waterColor += vec3(caustic * 0.2, caustic * 0.3, caustic * 0.4);
    
    // Realistic transparency with depth
    float alpha = 0.88 + fresnelFactor * 0.1;
    
    gl_FragColor = vec4(waterColor, alpha);
  }
`;

interface Ripple {
  position: THREE.Vector2;
  direction: THREE.Vector2;
  startTime: number;
  strength: number;
}

function WaterPlane({
  mousePosition,
  isMouseMoving,
  planeRef,
}: {
  mousePosition: { x: number; y: number };
  isMouseMoving: boolean;
  planeRef: React.RefObject<THREE.Mesh | null>;
}) {
  const { viewport, camera } = useThree();
  const wavesRef = useRef<Ripple[]>([]);
  const lastWaveTimeRef = useRef(0);
  const lastMousePosRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const mouseUV = useMemo(() => new THREE.Vector2(-1, -1), []);
  const mouseVel = useMemo(() => new THREE.Vector2(0, 0), []);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      mousePos: { value: mouseUV },
      mouseVelocity: { value: mouseVel },
      waveStrength: { value: 1.0 },
      wavePositions: {
        value: new Array(10)
          .fill(null)
          .map(() => new THREE.Vector3(-10, -10, 0)),
      },
      waveTimes: { value: new Array(10).fill(0) },
      waveDirections: {
        value: new Array(10).fill(null).map(() => new THREE.Vector2(0, 0)),
      },
      activeWaves: { value: 0 },
    }),
    [mouseUV, mouseVel]
  );

  useEffect(() => {
    return () => {
      wavesRef.current = [];
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const mesh = planeRef.current;
    if (!mesh) return;

    const material = mesh.material as THREE.ShaderMaterial;
    material.uniforms.time.value = time;

    raycaster.setFromCamera(
      new THREE.Vector2(mousePosition.x, mousePosition.y),
      camera
    );
    const intersects = raycaster.intersectObject(mesh);

    if (intersects.length > 0) {
      const point = intersects[0].point.clone();
      const local = mesh.worldToLocal(point);
      const width = viewport.width * 1.5;
      const height = viewport.height * 1.5;
      const uv = new THREE.Vector2(
        local.x / width + 0.5,
        local.y / height + 0.5
      );

      material.uniforms.mousePos.value.copy(uv);

      // Calculate mouse velocity
      const velocity = new THREE.Vector2().subVectors(
        uv,
        lastMousePosRef.current
      );
      const speed = velocity.length();

      if (speed > 0.001) {
        velocity.normalize();
        mouseVel.copy(velocity);
        material.uniforms.mouseVelocity.value.copy(velocity);
      }

      lastMousePosRef.current.copy(uv);

      // Create waves based on mouse movement with velocity
      if (
        isMouseMoving &&
        time - lastWaveTimeRef.current > 0.12 &&
        speed > 0.002
      ) {
        wavesRef.current.push({
          position: uv.clone(),
          direction: velocity.clone(),
          startTime: time,
          strength: Math.min(speed * 20.0, 2.0),
        });
        lastWaveTimeRef.current = time;

        if (wavesRef.current.length > 10) wavesRef.current.shift();
      }
    } else {
      material.uniforms.mousePos.value.set(-1, -1);
    }

    // Update wave uniforms
    wavesRef.current = wavesRef.current.filter(
      (wave) => time - wave.startTime < 3.0
    );

    material.uniforms.activeWaves.value = wavesRef.current.length;
    wavesRef.current.forEach((wave, i) => {
      material.uniforms.wavePositions.value[i].set(
        wave.position.x,
        wave.position.y,
        0
      );
      material.uniforms.waveTimes.value[i] = wave.startTime;
      material.uniforms.waveDirections.value[i].copy(wave.direction);
    });

    let totalStrength = 0;
    wavesRef.current.forEach((wave) => {
      const age = time - wave.startTime;
      totalStrength += wave.strength * (1.0 - age / 3.0);
    });
    material.uniforms.waveStrength.value = 1.0 + totalStrength * 0.3;
  });

  const geometry = useMemo(
    () =>
      new THREE.PlaneGeometry(
        viewport.width * 1.5,
        viewport.height * 1.5,
        128,
        128
      ),
    [viewport.width, viewport.height]
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [uniforms]
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <mesh
      ref={planeRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
      geometry={geometry}
      material={material}
    />
  );
}

export default function WaterSimulation({
  mousePosition,
  isMouseMoving,
}: {
  mousePosition: { x: number; y: number };
  isMouseMoving: boolean;
}) {
  const planeRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <WaterPlane
        mousePosition={mousePosition}
        isMouseMoving={isMouseMoving}
        planeRef={planeRef}
      />
      {/* Realistic lighting setup */}
      <ambientLight intensity={0.08} color="#0a0a15" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.4}
        color="#ffffff"
        castShadow
      />
      <hemisphereLight args={["#1a2a4a", "#000000", 0.3]} />
    </>
  );
}
