"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RealisticMoon() {
  const moonRef = useRef<THREE.Mesh>(null);

  // Exact implementation from CodePen - NASA textures
  const { moonMaterial } = useMemo(() => {
    const loader = new THREE.TextureLoader();

    const textureURL =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
    const displacementURL =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";

    const texture = loader.load(textureURL);
    const displacementMap = loader.load(displacementURL);

    const moonMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      displacementMap: displacementMap,
      displacementScale: 0.06,
      bumpMap: displacementMap,
      bumpScale: 0.04,
      shininess: 5,
      reflectivity: 0,
      color: 0xffffff,
    });

    return { moonMaterial };
  }, []);

  useFrame(() => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.0005;
    }
  });

  useEffect(() => {
    return () => {
      moonMaterial.dispose();
    };
  }, [moonMaterial]);

  return (
    <group position={[5.5, 3.5, -2]}>
      {/* Moon with exact CodePen setup */}
      <mesh ref={moonRef} material={moonMaterial}>
        <sphereGeometry args={[2, 128, 128]} />
      </mesh>

      {/* Lighting similar to CodePen */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        distance={8}
        color="#ffffff"
      />
      <pointLight
        position={[-2, 2, 2]}
        intensity={0.8}
        distance={12}
        color="#ffffee"
      />
    </group>
  );
}
