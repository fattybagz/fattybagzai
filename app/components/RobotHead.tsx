'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { MeshTransmissionMaterial, Environment, Float, Sparkles as DreiSparkles } from '@react-three/drei';

// Hyper-realistic Psychedelic Robot with advanced materials
function HyperRealisticRobot({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  // Custom shader for psychedelic effect
  const psychedelicMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#9333ea') },
        color2: { value: new THREE.Color('#ec4899') },
        color3: { value: new THREE.Color('#06b6d4') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Psychedelic color mixing
          float pattern = sin(vPosition.x * 5.0 + time) * 
                         sin(vPosition.y * 5.0 + time * 0.7) * 
                         sin(vPosition.z * 5.0 + time * 1.3);
          
          vec3 color = mix(color1, color2, (pattern + 1.0) * 0.5);
          color = mix(color, color3, sin(time + vPosition.y) * 0.5 + 0.5);
          
          // Fresnel effect for glow
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          color += fresnel * 0.5;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  useFrame((state, delta) => {
    setTime((t) => t + delta);
    
    if (psychedelicMaterial.uniforms) {
      psychedelicMaterial.uniforms.time.value = time;
    }

    if (groupRef.current) {
      // Smooth head rotation following cursor
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.3,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mousePosition.y * 0.2,
        0.03
      );
    }

    if (headRef.current) {
      // Gentle floating
      headRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      headRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }

    // Eye glow pulse
    if (leftEyeRef.current && rightEyeRef.current) {
      const glowIntensity = Math.sin(time * 2) * 2 + 3;
      (leftEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glowIntensity;
      (rightEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glowIntensity;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Head - Sleek metallic sphere with psychedelic shader */}
      <mesh ref={headRef} castShadow>
        <sphereGeometry args={[1.2, 128, 128]} />
        <primitive object={psychedelicMaterial} attach="material" />
      </mesh>

      {/* Face Plate - Chrome with iridescence */}
      <mesh position={[0, 0, 0.9]} castShadow>
        <boxGeometry args={[1.4, 1.6, 0.3]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          metalness={1}
          roughness={0.05}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          iridescence={1}
          iridescenceIOR={2.4}
          iridescenceThicknessRange={[100, 800]}
        />
      </mesh>

      {/* Left Eye - Cyberpunk glow */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={leftEyeRef} position={[-0.35, 0.2, 1.15]} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color="#00fff2"
            emissive="#00fff2"
            emissiveIntensity={3}
            metalness={0.3}
            roughness={0.1}
            toneMapped={false}
          />
          {/* Inner pupil */}
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={5}
              toneMapped={false}
            />
          </mesh>
        </mesh>
      </Float>

      {/* Right Eye */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={rightEyeRef} position={[0.35, 0.2, 1.15]} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color="#00fff2"
            emissive="#00fff2"
            emissiveIntensity={3}
            metalness={0.3}
            roughness={0.1}
            toneMapped={false}
          />
          {/* Inner pupil */}
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={5}
              toneMapped={false}
            />
          </mesh>
        </mesh>
      </Float>

      {/* Antenna Array */}
      <group position={[0, 1.4, 0]}>
        {/* Main Antenna */}
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1, 16]} />
          <meshPhysicalMaterial
            color="#a855f7"
            metalness={0.9}
            roughness={0.1}
            emissive="#a855f7"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Tip Orb - Pulsing */}
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={8}
              metalness={0.8}
              roughness={0.05}
              toneMapped={false}
            />
          </mesh>
        </Float>

        {/* Side Antennas */}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.2, 0]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
            <meshPhysicalMaterial
              color="#ec4899"
              metalness={0.9}
              roughness={0.1}
              emissive="#ec4899"
              emissiveIntensity={1}
            />
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#06b6d4"
                emissiveIntensity={4}
                toneMapped={false}
              />
            </mesh>
          </mesh>
        ))}
      </group>

      {/* Neck Joint - Mechanical details */}
      <group position={[0, -1.1, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.45, 0.5, 0.4, 32]} />
          <meshPhysicalMaterial
            color="#4c1d95"
            metalness={1}
            roughness={0.2}
            emissive="#7c3aed"
            emissiveIntensity={0.4}
            clearcoat={1}
          />
        </mesh>
        {/* Glowing rings */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -0.05 + i * 0.05, 0]}>
            <torusGeometry args={[0.5 + i * 0.05, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Ear Panels - Holographic */}
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0]} rotation={[0, 0, x > 0 ? -0.2 : 0.2]} castShadow>
          <boxGeometry args={[0.4, 1, 0.08]} />
          <meshPhysicalMaterial
            color="#a855f7"
            metalness={1}
            roughness={0.05}
            emissive="#a855f7"
            emissiveIntensity={0.8}
            iridescence={1}
            iridescenceIOR={2.333}
            iridescenceThicknessRange={[100, 800]}
            transmission={0.2}
            thickness={0.5}
          />
        </mesh>
      ))}

      {/* Orbiting Energy Particles */}
      <DreiSparkles
        count={100}
        scale={3}
        size={4}
        speed={0.4}
        opacity={0.8}
        color="#06b6d4"
      />
      <DreiSparkles
        count={80}
        scale={2.5}
        size={3}
        speed={0.6}
        opacity={0.6}
        color="#ec4899"
      />
    </group>
  );
}

export default function RobotHead() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
        }}
        shadows
      >
        <Environment preset="sunset" />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={40} color="#9333ea" castShadow />
        <pointLight position={[-5, -5, -5]} intensity={20} color="#ec4899" />
        <pointLight position={[0, 5, 2]} intensity={30} color="#06b6d4" />
        <spotLight
          position={[0, 3, 3]}
          angle={0.5}
          penumbra={1}
          intensity={50}
          color="#fbbf24"
          castShadow
        />
        
        <HyperRealisticRobot mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}

