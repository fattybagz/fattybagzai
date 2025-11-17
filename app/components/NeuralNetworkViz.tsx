"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  const nodes = 20;
  const nodePositions = Array.from({ length: nodes }, () => ({
    x: (Math.random() - 0.5) * 5,
    y: (Math.random() - 0.5) * 5,
    z: (Math.random() - 0.5) * 3,
  }));

  useFrame((state, delta) => {
    setTime(time + delta);
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodePositions.map((pos, i) => (
        <mesh key={`node-${i}`} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={Math.sin(time * 2 + i) * 0.5 + 1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Connections */}
      {nodePositions.map((pos1, i) =>
        nodePositions.slice(i + 1).map((pos2, j) => {
          if (Math.random() > 0.7) return null;

          return (
            <mesh
              key={`line-${i}-${j}`}
              position={[
                (pos1.x + pos2.x) / 2,
                (pos1.y + pos2.y) / 2,
                (pos1.z + pos2.z) / 2,
              ]}
            >
              <cylinderGeometry
                args={[
                  0.02,
                  0.02,
                  Math.sqrt(
                    Math.pow(pos2.x - pos1.x, 2) +
                      Math.pow(pos2.y - pos1.y, 2) +
                      Math.pow(pos2.z - pos1.z, 2)
                  ),
                  8,
                ]}
              />
              <meshStandardMaterial
                color="#a855f7"
                emissive="#a855f7"
                emissiveIntensity={0.3}
                transparent
                opacity={0.4}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

export default function NeuralNetworkViz() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#a855f7" />
        <NeuralNetwork />
      </Canvas>
    </div>
  );
}
