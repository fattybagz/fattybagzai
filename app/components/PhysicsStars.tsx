"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Star {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  brightness: number;
  size: number;
  mass: number;
}

export default function PhysicsStars({
  mousePosition,
  isMouseMoving,
}: {
  mousePosition: { x: number; y: number };
  isMouseMoving: boolean;
}) {
  const { viewport, camera } = useThree();
  const starsRef = useRef<Star[]>([]);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseWorldPos = useRef<THREE.Vector3>(new THREE.Vector3());

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Initialize stars with proper depth - extending down to water
  useEffect(() => {
    const stars: Star[] = [];
    const numStars = 400;

    for (let i = 0; i < numStars; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 2.5;
      const y = (Math.random() - 0.3) * viewport.height * 2.5; // Extend down to water level
      const z = -20 + Math.random() * 15; // Behind moon (moon is at z: -2)

      // Vary star properties for realism
      const brightness = 0.3 + Math.random() * 0.7;
      const size = brightness * (0.015 + Math.random() * 0.025);

      stars.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.0005,
          0
        ),
        brightness: brightness,
        size: size,
        mass: 0.5 + Math.random() * 1.5,
      });
    }

    starsRef.current = stars;
  }, [viewport]);

  useFrame(() => {
    if (!instancedMeshRef.current) return;

    starsRef.current.forEach((star, i) => {
      // Stars should be completely static in space - no drift
      // Remove all velocity updates to prevent mouse-triggered movement

      star.position.add(star.velocity.multiplyScalar(0));

      // No boundary wrapping - stars stay fixed in their positions

      // Update instance matrix
      tempObject.position.copy(star.position);
      tempObject.scale.setScalar(star.size);
      tempObject.updateMatrix();
      instancedMeshRef.current!.setMatrixAt(i, tempObject.matrix);

      // Realistic twinkling with varied frequencies
      const twinkleSpeed = 0.0003 + star.brightness * 0.0002;
      const twinkle =
        Math.sin(Date.now() * twinkleSpeed + i * 100) * 0.12 + 0.88;

      // Color variation - some stars are slightly blue/yellow tinted
      const colorTint = (i % 10) / 30;
      const r = star.brightness * twinkle * (1.0 - colorTint * 0.1);
      const g = star.brightness * twinkle * (1.0 - colorTint * 0.05);
      const b = star.brightness * twinkle * (1.0 + colorTint * 0.15);

      tempColor.setRGB(r, g, b);

      if (instancedMeshRef.current!.instanceColor) {
        instancedMeshRef.current!.setColorAt(i, tempColor);
      }
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, 400]}
      frustumCulled={false}
    >
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
