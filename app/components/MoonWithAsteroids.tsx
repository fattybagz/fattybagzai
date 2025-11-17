"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Realistic moon shader with photorealistic detail
const moonVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const moonFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  
  // High-quality 3D noise for realistic crater detail
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    // Photorealistic moon surface colors
    vec3 moonHighlight = vec3(0.92, 0.90, 0.88);
    vec3 moonMid = vec3(0.72, 0.70, 0.68);
    vec3 moonShadow = vec3(0.35, 0.34, 0.33);
    vec3 craterDark = vec3(0.22, 0.21, 0.20);
    
    // Multi-octave noise for realistic surface detail
    float noise1 = snoise(vPosition * 2.0) * 0.5 + 0.5;
    float noise2 = snoise(vPosition * 5.0) * 0.5 + 0.5;
    float noise3 = snoise(vPosition * 12.0) * 0.5 + 0.5;
    float noise4 = snoise(vPosition * 25.0) * 0.5 + 0.5;
    
    // Large craters (maria - dark patches)
    float largeCraters = pow(noise1, 3.0);
    
    // Medium detail
    float mediumDetail = noise2;
    
    // Fine surface texture
    float fineDetail = noise3 * 0.3 + noise4 * 0.1;
    
    // Combine details
    float surfaceDetail = mix(
      mix(moonShadow.r, moonMid.r, mediumDetail),
      moonHighlight.r,
      1.0 - largeCraters
    );
    
    surfaceDetail += fineDetail;
    
    vec3 surfaceColor = vec3(surfaceDetail) * vec3(1.0, 0.98, 0.96);
    
    // Darken craters more
    surfaceColor = mix(craterDark, surfaceColor, smoothstep(0.0, 0.4, largeCraters + mediumDetail * 0.3));
    
    // Realistic lighting from sun direction
    vec3 lightDir = normalize(vec3(0.8, 0.5, 1.0));
    vec3 normal = normalize(vNormal);
    
    // Calculate surface normal perturbation from noise for depth
    vec3 perturbedNormal = normal;
    perturbedNormal.x += (noise3 - 0.5) * 0.3;
    perturbedNormal.y += (noise4 - 0.5) * 0.3;
    perturbedNormal = normalize(perturbedNormal);
    
    // Diffuse lighting with perturbation
    float diffuse = max(dot(perturbedNormal, lightDir), 0.0);
    diffuse = pow(diffuse, 0.8); // Slightly soften
    
    // Ambient occlusion in craters
    float ao = smoothstep(0.0, 0.5, largeCraters + mediumDetail * 0.5);
    
    // Subsurface scattering effect on terminator
    float sss = pow(max(dot(normal, lightDir), 0.0), 0.3) * 0.15;
    
    // Combine lighting
    vec3 ambient = surfaceColor * 0.15;
    vec3 diffuseColor = surfaceColor * diffuse * 0.85;
    
    vec3 finalColor = ambient + diffuseColor + vec3(sss);
    finalColor *= ao;
    
    // Subtle rim lighting for depth
    vec3 viewDir = normalize(vViewPosition);
    float rimLight = 1.0 - max(dot(viewDir, normal), 0.0);
    rimLight = pow(rimLight, 4.0) * 0.2;
    finalColor += vec3(rimLight) * moonHighlight;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface Asteroid {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  size: number;
  life: number;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  size: number;
  color: THREE.Color;
}

function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const moonUniforms = useMemo(
    () => ({
      time: { value: 0 },
    }),
    []
  );

  const moonMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: moonVertexShader,
        fragmentShader: moonFragmentShader,
        uniforms: moonUniforms,
      }),
    [moonUniforms]
  );

  // Atmospheric glow material
  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float intensity = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
        vec3 glowColor = vec3(0.95, 0.93, 0.88);
        gl_FragColor = vec4(glowColor * intensity, intensity * 0.4);
      }
    `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (moonRef.current) {
      moonUniforms.time.value = clock.getElapsedTime();
      moonRef.current.rotation.y += 0.0005;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.0005;
    }
  });

  useEffect(() => {
    return () => {
      moonMaterial.dispose();
      glowMaterial.dispose();
    };
  }, [moonMaterial, glowMaterial]);

  return (
    <group position={[5, 3, -3]}>
      {/* Main moon */}
      <mesh ref={moonRef} material={moonMaterial}>
        <sphereGeometry args={[1.8, 128, 128]} />
      </mesh>

      {/* Atmospheric glow */}
      <mesh ref={glowRef} material={glowMaterial} scale={1.15}>
        <sphereGeometry args={[1.8, 64, 64]} />
      </mesh>
    </group>
  );
}

function AsteroidSystem() {
  const { viewport } = useThree();
  const asteroidsRef = useRef<Asteroid[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const asteroidMeshRef = useRef<THREE.InstancedMesh>(null);
  const particleMeshRef = useRef<THREE.InstancedMesh>(null);
  const lastSpawnRef = useRef(0);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const moonPosition = useMemo(() => new THREE.Vector3(5, 3, -3), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Spawn asteroids periodically
    if (time - lastSpawnRef.current > 2.5) {
      lastSpawnRef.current = time;

      const angle = Math.random() * Math.PI * 2;
      const distance = 15;
      const startPos = new THREE.Vector3(
        moonPosition.x + Math.cos(angle) * distance,
        moonPosition.y + (Math.random() - 0.5) * 10,
        moonPosition.z + Math.sin(angle) * distance
      );

      const toMoon = new THREE.Vector3()
        .subVectors(moonPosition, startPos)
        .normalize();
      const speed = 0.08 + Math.random() * 0.06;

      asteroidsRef.current.push({
        position: startPos,
        velocity: toMoon.multiplyScalar(speed),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        size: 0.1 + Math.random() * 0.15,
        life: 1.0,
      });

      if (asteroidsRef.current.length > 15) asteroidsRef.current.shift();
    }

    // Update asteroids
    asteroidsRef.current.forEach((asteroid) => {
      asteroid.position.add(asteroid.velocity);
      asteroid.rotation.x += asteroid.rotationSpeed.x;
      asteroid.rotation.y += asteroid.rotationSpeed.y;
      asteroid.rotation.z += asteroid.rotationSpeed.z;

      // Check collision with moon
      const distToMoon = asteroid.position.distanceTo(moonPosition);
      if (distToMoon < 1.3) {
        // Create explosion particles
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const elevation = Math.random() * Math.PI;
          const speed = 0.05 + Math.random() * 0.15;

          particlesRef.current.push({
            position: asteroid.position.clone(),
            velocity: new THREE.Vector3(
              Math.sin(elevation) * Math.cos(angle) * speed,
              Math.sin(elevation) * Math.sin(angle) * speed,
              Math.cos(elevation) * speed
            ),
            life: 1.0,
            size: 0.03 + Math.random() * 0.05,
            color: new THREE.Color().setHSL(
              0.05 + Math.random() * 0.1,
              0.8,
              0.5 + Math.random() * 0.3
            ),
          });
        }

        asteroid.life = 0;
      }
    });

    // Remove dead asteroids
    asteroidsRef.current = asteroidsRef.current.filter((a) => a.life > 0);

    // Update particles
    particlesRef.current.forEach((particle) => {
      particle.velocity.y -= 0.004; // Gravity
      particle.position.add(particle.velocity);
      particle.life -= 0.015;
    });

    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    // Update asteroid instances
    if (asteroidMeshRef.current) {
      asteroidsRef.current.forEach((asteroid, i) => {
        tempObject.position.copy(asteroid.position);
        tempObject.rotation.copy(asteroid.rotation);
        tempObject.scale.setScalar(asteroid.size);
        tempObject.updateMatrix();
        asteroidMeshRef.current!.setMatrixAt(i, tempObject.matrix);
      });

      asteroidMeshRef.current.count = asteroidsRef.current.length;
      asteroidMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update particle instances
    if (particleMeshRef.current) {
      particlesRef.current.forEach((particle, i) => {
        tempObject.position.copy(particle.position);
        tempObject.scale.setScalar(particle.size * particle.life);
        tempObject.updateMatrix();
        particleMeshRef.current!.setMatrixAt(i, tempObject.matrix);

        tempColor.copy(particle.color);
        tempColor.multiplyScalar(particle.life);
        if (particleMeshRef.current!.instanceColor) {
          particleMeshRef.current!.setColorAt(i, tempColor);
        }
      });

      particleMeshRef.current.count = particlesRef.current.length;
      particleMeshRef.current.instanceMatrix.needsUpdate = true;
      if (particleMeshRef.current.instanceColor) {
        particleMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
  });

  return (
    <>
      <instancedMesh
        ref={asteroidMeshRef}
        args={[undefined, undefined, 15]}
        frustumCulled={false}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} metalness={0.1} />
      </instancedMesh>

      <instancedMesh
        ref={particleMeshRef}
        args={[undefined, undefined, 500]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial transparent blending={THREE.AdditiveBlending} />
      </instancedMesh>
    </>
  );
}

export default function MoonWithAsteroids() {
  return (
    <>
      <Moon />
      <AsteroidSystem />
      {/* Bright moonlight */}
      <pointLight
        position={[5, 3, -3]}
        intensity={3.5}
        distance={12}
        decay={2}
        color="#fffef8"
      />
      {/* Ambient moonlight glow */}
      <pointLight
        position={[5, 3, 0]}
        intensity={0.8}
        distance={15}
        decay={2}
        color="#e8e6dc"
      />
    </>
  );
}
