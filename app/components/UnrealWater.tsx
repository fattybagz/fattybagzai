"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function UnrealWater({
  mousePosition,
  isMouseMoving,
}: {
  mousePosition: { x: number; y: number };
  isMouseMoving: boolean;
}) {
  const neuronsRef = useRef<THREE.Points>(null);
  const connectionsRef = useRef<THREE.LineSegments>(null);
  const { viewport, camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseWorldPos = useRef(new THREE.Vector3());
  const neuronCount = 400; // Reduced from 1200 for better performance
  const maxConnectionDistance = 2.5;

  const { neuronPositions, neuronVelocities, neuronColors, neuronSizes } =
    useMemo(() => {
      const positions = new Float32Array(neuronCount * 3);
      const velocities = new Float32Array(neuronCount * 3);
      const colors = new Float32Array(neuronCount * 3);
      const sizes = new Float32Array(neuronCount);

      for (let i = 0; i < neuronCount; i++) {
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 2 + Math.random() * 1.5;
        const frontalBias = phi < Math.PI / 2 ? 1.2 : 1.0;

        positions[i3] = Math.sin(phi) * Math.cos(theta) * radius * frontalBias;
        positions[i3 + 1] = Math.cos(phi) * radius * 0.8;
        positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 2;

        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

        const colorMix = Math.random();
        colors[i3] = 0.2 + colorMix * 0.8; // More red
        colors[i3 + 1] = 0.6 + colorMix * 0.4; // More green
        colors[i3 + 2] = 1.0; // Full blue

        sizes[i] = 0.1 + Math.random() * 0.2;
      }

      return {
        neuronPositions: positions,
        neuronVelocities: velocities,
        neuronColors: colors,
        neuronSizes: sizes,
      };
    }, [neuronCount]);

  const neuronMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMousePos: { value: new THREE.Vector3() },
        uMouseStrength: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uMousePos;
        uniform float uMouseStrength;
        
        attribute float size;
        attribute vec3 customColor;
        
        varying vec3 vColor;
        varying float vGlow;
        
        void main() {
          vColor = customColor;
          vec3 pos = position;
          
          float pulse = sin(uTime * 2.0 + position.x * 0.5 + position.y * 0.3) * 0.5 + 0.5;
          float distToMouse = length(position - uMousePos);
          float mouseEffect = smoothstep(3.0, 0.0, distToMouse) * uMouseStrength;
          
          if(mouseEffect > 0.01) {
            vec3 toMouse = normalize(uMousePos - position);
            pos += toMouse * mouseEffect * 0.8;
            vGlow = mouseEffect * 2.0;
          } else {
            vGlow = pulse * 0.3;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * 150.0 * (1.0 + mouseEffect * 2.0) * (1.0 + pulse * 0.3);
          gl_PointSize *= (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vGlow;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if(dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          float core = 1.0 - smoothstep(0.0, 0.25, dist);
          
          vec3 color = vColor * (1.0 + vGlow);
          color += vec3(1.0) * core * 0.5;
          
          gl_FragColor = vec4(color, alpha * (0.7 + vGlow * 0.3));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  const connectionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMousePos: { value: new THREE.Vector3() },
        uMouseStrength: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uMousePos;
        uniform float uMouseStrength;
        
        attribute vec3 color;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          float distToMouse = length(position - uMousePos);
          float mouseEffect = smoothstep(3.5, 0.0, distToMouse) * uMouseStrength;
          float pulse = sin(uTime * 3.0 + position.x + position.y) * 0.5 + 0.5;
          
          vAlpha = 0.15 + pulse * 0.1 + mouseEffect * 0.5;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          gl_FragColor = vec4(vColor, vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();
    if (neuronMaterial.uniforms) neuronMaterial.uniforms.uTime.value = time;
    if (connectionMaterial.uniforms)
      connectionMaterial.uniforms.uTime.value = time;

    raycaster.setFromCamera(mouse, camera);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, intersectPoint);
    mouseWorldPos.current.lerp(intersectPoint, 0.1);
    const strength = isMouseMoving ? 1.0 : 0.0;

    if (neuronMaterial.uniforms) {
      neuronMaterial.uniforms.uMousePos.value.copy(mouseWorldPos.current);
      neuronMaterial.uniforms.uMouseStrength.value = strength;
    }
    if (connectionMaterial.uniforms) {
      connectionMaterial.uniforms.uMousePos.value.copy(mouseWorldPos.current);
      connectionMaterial.uniforms.uMouseStrength.value = strength;
    }

    if (neuronsRef.current) {
      const positions = neuronsRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < neuronCount; i++) {
        const i3 = i * 3;
        positions[i3] += neuronVelocities[i3];
        positions[i3 + 1] += neuronVelocities[i3 + 1];
        positions[i3 + 2] += neuronVelocities[i3 + 2];
        const dist = Math.sqrt(
          positions[i3] ** 2 +
            positions[i3 + 1] ** 2 +
            (positions[i3 + 2] + 2) ** 2
        );
        if (dist > 4.0 || dist < 1.5) {
          neuronVelocities[i3] *= -0.5;
          neuronVelocities[i3 + 1] *= -0.5;
          neuronVelocities[i3 + 2] *= -0.5;
        }
      }
      neuronsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (connectionsRef.current && neuronsRef.current) {
      const positions = neuronsRef.current.geometry.attributes.position
        .array as Float32Array;
      const connectionPositions: number[] = [];
      const connectionColors: number[] = [];
      for (let i = 0; i < neuronCount; i++) {
        const i3 = i * 3;
        const x1 = positions[i3];
        const y1 = positions[i3 + 1];
        const z1 = positions[i3 + 2];
        for (let j = i + 1; j < Math.min(i + 50, neuronCount); j++) {
          const j3 = j * 3;
          const x2 = positions[j3];
          const y2 = positions[j3 + 1];
          const z2 = positions[j3 + 2];
          const dist = Math.sqrt(
            (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
          );
          if (dist < maxConnectionDistance) {
            connectionPositions.push(x1, y1, z1, x2, y2, z2);
            const colorMix = 1.0 - dist / maxConnectionDistance;
            connectionColors.push(
              0.0 + colorMix * 0.5,
              0.7,
              1.0,
              0.3 + colorMix * 0.4,
              0.5,
              1.0
            );
          }
        }
      }
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(connectionPositions, 3)
      );
      newGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(connectionColors, 3)
      );
      connectionsRef.current.geometry.dispose();
      connectionsRef.current.geometry = newGeometry;
    }
  });

  useEffect(() => {
    return () => {
      neuronMaterial.dispose();
      connectionMaterial.dispose();
    };
  }, [neuronMaterial, connectionMaterial]);

  return (
    <>
      <lineSegments ref={connectionsRef} material={connectionMaterial}>
        <bufferGeometry />
      </lineSegments>
      <points ref={neuronsRef} material={neuronMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[neuronPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-customColor"
            args={[neuronColors, 3]}
          />
          <bufferAttribute attach="attributes-size" args={[neuronSizes, 1]} />
        </bufferGeometry>
      </points>
      <ambientLight intensity={0.3} color="#0a0a20" />
      <pointLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#00d9ff"
        distance={20}
      />
      <pointLight
        position={[-5, -3, -5]}
        intensity={0.6}
        color="#b800ff"
        distance={20}
      />
      <pointLight
        position={[0, 8, 0]}
        intensity={0.4}
        color="#ffffff"
        distance={15}
      />
    </>
  );
}
