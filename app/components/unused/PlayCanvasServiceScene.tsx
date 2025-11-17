"use client";

import { Application, Entity } from "@playcanvas/react";
import {
  Camera,
  Light,
  Render,
  Script,
  RigidBody,
  Collision,
} from "@playcanvas/react/components";
import { OrbitControls } from "@playcanvas/react/scripts";
import { Script as PcScript } from "playcanvas";
import { useRef, useState, useEffect } from "react";

interface ServiceSceneProps {
  variant?: "ai" | "automation" | "analytics";
}

class PhysicsSetupScript extends PcScript {
  static scriptName = "PhysicsSetupScript";
  
  initialize() {
    if (this.app && this.app.systems && this.app.systems.rigidbody) {
      this.app.systems.rigidbody.gravity.set(0, -9.81, 0);
    }
  }
}

class MouseInteractionScript extends PcScript {
  static scriptName = "MouseInteractionScript";
  
  mouseWorldPos: any = { x: 0, y: 0, z: 0 };
  force = 3;

  update(dt: number) {
    if (!this.entity.rigidbody) return;

    const entityPos = this.entity.getPosition();
    const dx = this.mouseWorldPos.x - entityPos.x;
    const dy = this.mouseWorldPos.y - entityPos.y;
    const dz = this.mouseWorldPos.z - entityPos.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < 4) {
      const forceMagnitude = this.force * (1 - distance / 4);
      this.entity.rigidbody.applyForce(
        dx * forceMagnitude * 12,
        dy * forceMagnitude * 12,
        dz * forceMagnitude * 12
      );
    }

    const angularVel = this.entity.rigidbody.angularVelocity;
    this.entity.rigidbody.angularVelocity = angularVel.mulScalar(0.98);
  }

  setMousePosition(x: number, y: number, z: number) {
    this.mouseWorldPos = { x, y, z };
  }
}

export default function PlayCanvasServiceScene({
  variant = "ai",
}: ServiceSceneProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const entityRefs = useRef<any[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x: x * 3, y: y * 3 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    entityRefs.current.forEach((entity) => {
      if (entity && entity.script && entity.script.get) {
        const mouseScript = entity.script.get("MouseInteractionScript");
        if (mouseScript && typeof mouseScript.setMousePosition === 'function') {
          mouseScript.setMousePosition(mousePos.x, mousePos.y, 0);
        }
      }
    });
  }, [mousePos]);

  const handleEntityRef = (entity: any) => {
    if (entity && !entityRefs.current.includes(entity)) {
      entityRefs.current.push(entity);
    }
  };

  const getColorScheme = () => {
    switch (variant) {
      case "ai":
        return { primary: "#7fff00", secondary: "#00ff9f" };
      case "automation":
        return { primary: "#00d9ff", secondary: "#0099ff" };
      case "analytics":
        return { primary: "#ff00ff", secondary: "#b800ff" };
      default:
        return { primary: "#7fff00", secondary: "#00ff9f" };
    }
  };

  const colors = getColorScheme();

  return (
    <div className="w-full h-full">
      <Application usePhysics>
        {/* Physics setup entity */}
        <Entity>
          <Script script={PhysicsSetupScript} />
        </Entity>

        <Entity position={[0, 0, 5]}>
          <Camera clearColor="#00000000" farClip={50} nearClip={0.1} />
          <OrbitControls inertiaFactor={0.3} distanceMax={10} distanceMin={3} />
        </Entity>

        <Entity rotation={[30, 45, 0]}>
          <Light type="directional" color={colors.primary} intensity={1.2} />
        </Entity>

        <Entity position={[3, 2, 2]}>
          <Light
            type="omni"
            color={colors.secondary}
            intensity={1.5}
            range={10}
          />
        </Entity>

        {/* AI variant - orbiting pill capsules */}
        {variant === "ai" && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <Entity
                key={i}
                position={[
                  Math.cos((i * Math.PI * 2) / 4) * 1.5,
                  Math.sin((i * Math.PI * 2) / 4) * 0.3,
                  Math.sin((i * Math.PI * 2) / 4) * 1.5,
                ]}
                rotation={[0, i * 45, 0]}
                ref={handleEntityRef}
              >
                <Render type="capsule" castShadows />
                <RigidBody
                  type="dynamic"
                  mass={0.5}
                  friction={0.5}
                  restitution={0.3}
                />
                <Collision type="capsule" radius={0.3} height={1.2} />
                <Script script={MouseInteractionScript} force={3} />
              </Entity>
            ))}
          </>
        )}

        {/* Automation variant - multiple pill boxes */}
        {variant === "automation" && (
          <>
            {[
              { pos: [0, 0, 0], rot: [0, 0, 0] },
              { pos: [1, 0.5, 0.5], rot: [45, 45, 0] },
              { pos: [-1, -0.5, -0.5], rot: [30, 60, 0] },
            ].map((item, i) => (
              <Entity
                key={i}
                position={item.pos as [number, number, number]}
                rotation={item.rot as [number, number, number]}
                ref={handleEntityRef}
              >
                <Render type="capsule" castShadows />
                <RigidBody
                  type="dynamic"
                  mass={0.8}
                  friction={0.5}
                  restitution={0.3}
                />
                <Collision type="capsule" radius={0.25} height={1.5} />
                <Script script={MouseInteractionScript} force={4} />
              </Entity>
            ))}
          </>
        )}

        {/* Analytics variant - stacked pills */}
        {variant === "analytics" && (
          <>
            {[0, 1, 2].map((i) => (
              <Entity
                key={i}
                position={[0, -0.5 + i * 0.7, 0]}
                rotation={[0, i * 30, 0]}
                ref={handleEntityRef}
              >
                <Render type="capsule" castShadows />
                <RigidBody
                  type="dynamic"
                  mass={0.6}
                  friction={0.5}
                  restitution={0.3}
                />
                <Collision type="capsule" radius={0.3} height={1.3} />
                <Script script={MouseInteractionScript} force={3} />
              </Entity>
            ))}
          </>
        )}

        {/* Invisible floor */}
        <Entity position={[0, -2, 0]} rotation={[-90, 0, 0]}>
          <RigidBody type="static" />
          <Collision type="box" halfExtents={[5, 5, 0.5]} />
        </Entity>
      </Application>
    </div>
  );
}
