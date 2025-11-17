"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import PhysicsStars from "./PhysicsStars";
import RealisticMoon from "./RealisticMoon";
import UnrealWater from "./UnrealWater";
import dynamic from "next/dynamic";

const LavaParticles = dynamic(() => import("./ParticleField"), {
  ssr: false,
});

export type EffectType = "lava" | "water";

interface CursorParticleFieldProps {
  effectType?: EffectType;
}

export default function CursorParticleField({
  effectType = "lava",
}: CursorParticleFieldProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [movementTimeout, setMovementTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
      setIsMouseMoving(true);

      // Clear existing timeout
      if (movementTimeout) {
        clearTimeout(movementTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        setIsMouseMoving(false);
      }, 100);
      setMovementTimeout(timeout);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (movementTimeout) {
        clearTimeout(movementTimeout);
      }
    };
  }, [movementTimeout]);

  if (effectType === "water") {
    return (
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[0.75, 1.5]}
        frameloop="always"
      >
        <color attach="background" args={["#000000"]} />

        {/* Realistic twinkling stars behind everything */}
        <PhysicsStars
          mousePosition={mousePosition}
          isMouseMoving={isMouseMoving}
        />

        {/* AI Neural Network Scene with electromagnetic physics */}
        <UnrealWater
          mousePosition={mousePosition}
          isMouseMoving={isMouseMoving}
        />
      </Canvas>
    );
  }

  // Lava effect (using ParticleField)
  return <LavaParticles />;
}
