'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';

function PsychedelicRobot({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(time + delta);

    if (headRef.current) {
      // Smooth head rotation following cursor
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        mousePosition.x * 0.5,
        0.05
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        mousePosition.y * 0.3,
        0.05
      );

      // Floating animation
      headRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }

    // Eye glow pulse
    if (leftEyeRef.current && rightEyeRef.current) {
      const glowIntensity = Math.sin(time * 3) * 0.5 + 1;
      (leftEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glowIntensity;
      (rightEyeRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glowIntensity;
    }
  });

  return (
    <group ref={headRef}>
      {/* Main Head - Psychedelic distorted sphere */}
      <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#9333ea"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Face plate - glossy surface */}
      <mesh position={[0, 0, 1.2]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1.2, 0.3, 32]} />
        <meshStandardMaterial
          color="#ec4899"
          metalness={0.9}
          roughness={0.1}
          emissive="#ec4899"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Left Eye - glowing */}
      <mesh ref={leftEyeRef} position={[-0.4, 0.3, 1.4]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Right Eye - glowing */}
      <mesh ref={rightEyeRef} position={[0.4, 0.3, 1.4]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Antenna with rotating orb */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
          <meshStandardMaterial color="#a855f7" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1.5}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Neck joint */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.6, 32]} />
        <meshStandardMaterial
          color="#7c3aed"
          metalness={0.9}
          roughness={0.1}
          emissive="#7c3aed"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Ear panels */}
      <mesh position={[-1.3, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial
          color="#a855f7"
          metalness={0.8}
          roughness={0.2}
          emissive="#a855f7"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[1.3, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial
          color="#a855f7"
          metalness={0.8}
          roughness={0.2}
          emissive="#a855f7"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Psychedelic particles around head */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 2.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle + time) * radius,
              Math.sin(time * 2 + i) * 0.5,
              Math.sin(angle + time) * radius,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={`hsl(${(i * 7 + time * 50) % 360}, 100%, 50%)`}
              emissive={`hsl(${(i * 7 + time * 50) % 360}, 100%, 50%)`}
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function RobotHead() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
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
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.5}
          penumbra={1}
          intensity={2}
          color="#fbbf24"
        />
        
        <PsychedelicRobot mousePosition={mousePosition} />
        
        {/* Uncomment for manual controls */}
        {/* <OrbitControls enableZoom={false} /> */}
      </Canvas>
    </div>
  );
}
