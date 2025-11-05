'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';

function FloatingAIOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(time + delta);
    
    if (orbRef.current) {
      orbRef.current.rotation.x = time * 0.3;
      orbRef.current.rotation.y = time * 0.2;
      orbRef.current.position.y = Math.sin(time * 0.8) * 0.5;
      orbRef.current.position.x = Math.cos(time * 0.5) * 0.3;
    }
  });

  return (
    <group>
      <Sphere ref={orbRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#a855f7"
          attach="material"
          distort={0.6}
          speed={3}
          roughness={0.1}
          metalness={1}
          emissive="#ec4899"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Orbiting rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
          position={[0, 0, 0]}
        >
          <torusGeometry args={[2 + i * 0.3, 0.05, 16, 100]} />
          <meshStandardMaterial
            color={`hsl(${270 + i * 30}, 80%, 60%)`}
            emissive={`hsl(${270 + i * 30}, 80%, 60%)`}
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function AIOrb() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#a855f7" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ec4899" />
        <FloatingAIOrb />
      </Canvas>
    </div>
  );
}
