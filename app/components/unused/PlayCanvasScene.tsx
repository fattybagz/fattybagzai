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

// Physics setup script that runs once to configure gravity
class PhysicsSetupScript extends PcScript {
  static scriptName = "PhysicsSetupScript";
  
  initialize() {
    if (this.app && this.app.systems && this.app.systems.rigidbody) {
      this.app.systems.rigidbody.gravity.set(0, -9.81, 0);
    }
  }
}

// Mouse interaction script - applies impulse force on click
class ClickForceScript extends PcScript {
  static scriptName = "ClickForceScript";
  
  mouseWorldPos: any = { x: 0, y: 0, z: 0 };
  isMouseDown = false;

  update(dt: number) {
    if (!this.entity.rigidbody || !this.isMouseDown) return;

    const entityPos = this.entity.getPosition();
    const dx = this.mouseWorldPos.x - entityPos.x;
    const dy = this.mouseWorldPos.y - entityPos.y;
    const dz = this.mouseWorldPos.z - entityPos.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < 6) {
      const forceMagnitude = 20 * (1 - distance / 6);
      this.entity.rigidbody.applyForce(
        dx * forceMagnitude,
        dy * forceMagnitude,
        dz * forceMagnitude
      );
    }
  }

  setMousePosition(x: number, y: number, z: number) {
    this.mouseWorldPos = { x, y, z };
  }

  setMouseDown(down: boolean) {
    this.isMouseDown = down;
  }
}

// Auto-spawner script - spawns new robot heads periodically
class SpawnerScript extends PcScript {
  static scriptName = "SpawnerScript";
  
  spawnTimer = 0;
  spawnInterval = 0.8; // Spawn every 0.8 seconds
  maxEntities = 30;

  update(dt: number) {
    this.spawnTimer += dt;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.entity.fire("spawn-robot-head");
    }
  }
}

// Robot head type - geometric composition
interface RobotHeadConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale: number;
}

export default function PlayCanvasScene() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [robotHeads, setRobotHeads] = useState<RobotHeadConfig[]>([]);
  const entityRefs = useRef<any[]>([]);
  const spawnTimerRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x: x * 8, y: y * 8 });
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    entityRefs.current.forEach((entity) => {
      if (entity && entity.script && entity.script.get) {
        const clickScript = entity.script.get("ClickForceScript");
        if (clickScript && typeof clickScript.setMousePosition === 'function') {
          clickScript.setMousePosition(mousePos.x, mousePos.y, 0);
          clickScript.setMouseDown(isMouseDown);
        }
      }
    });
  }, [mousePos, isMouseDown]);

  // Spawn robot heads periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (robotHeads.length < 25) {
        const colors = [
          "#7fff00",
          "#00ff9f",
          "#00d9ff",
          "#b800ff",
          "#ff00ff",
          "#ff6b00",
        ];
        const newHead: RobotHeadConfig = {
          position: [
            (Math.random() - 0.5) * 8,
            10 + Math.random() * 2,
            (Math.random() - 0.5) * 4,
          ],
          rotation: [
            Math.random() * 360,
            Math.random() * 360,
            Math.random() * 360,
          ],
          color: colors[Math.floor(Math.random() * colors.length)],
          scale: 0.6 + Math.random() * 0.4,
        };
        setRobotHeads((prev) => [...prev, newHead]);
      } else {
        // Remove oldest head when limit reached
        setRobotHeads((prev) => [
          ...prev.slice(1),
          {
            position: [
              (Math.random() - 0.5) * 8,
              10 + Math.random() * 2,
              (Math.random() - 0.5) * 4,
            ],
            rotation: [
              Math.random() * 360,
              Math.random() * 360,
              Math.random() * 360,
            ],
            color: [
              "#7fff00",
              "#00ff9f",
              "#00d9ff",
              "#b800ff",
              "#ff00ff",
              "#ff6b00",
            ][Math.floor(Math.random() * 6)],
            scale: 0.6 + Math.random() * 0.4,
          },
        ]);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [robotHeads.length]);

  const handleEntityRef = (entity: any) => {
    if (entity && !entityRefs.current.includes(entity)) {
      entityRefs.current.push(entity);
    }
  };

  return (
    <div className="w-full h-full">
      <Application usePhysics>
        {/* Physics setup entity */}
        <Entity>
          <Script script={PhysicsSetupScript} />
        </Entity>

        {/* Camera with orbit controls */}
        <Entity position={[0, 4, 12]}>
          <Camera clearColor="#000000" farClip={100} nearClip={0.1} />
          <OrbitControls inertiaFactor={0.2} distanceMax={25} distanceMin={8} />
        </Entity>

        {/* Main directional light */}
        <Entity rotation={[45, 30, 0]}>
          <Light
            type="directional"
            color="#ffffff"
            intensity={1.2}
            castShadows
          />
        </Entity>

        {/* Accent lights for colorful atmosphere */}
        <Entity position={[-8, 5, 5]}>
          <Light type="omni" color="#00d9ff" intensity={2} range={20} />
        </Entity>

        <Entity position={[8, 5, -5]}>
          <Light type="omni" color="#b800ff" intensity={2} range={20} />
        </Entity>

        <Entity position={[0, 8, 0]}>
          <Light type="omni" color="#7fff00" intensity={1.5} range={15} />
        </Entity>

        {/* Falling Robot Heads - Each head is composed of multiple primitives */}
        {robotHeads.map((head, index) => (
          <Entity
            key={`robot-head-${index}`}
            position={head.position}
            rotation={head.rotation}
            ref={handleEntityRef}
          >
            {/* Main head - box */}
            <Entity
              position={[0, 0, 0]}
              scale={[head.scale, head.scale, head.scale]}
            >
              <Render type="box" castShadows receiveShadows />
              <RigidBody
                type="dynamic"
                mass={1.5}
                friction={0.5}
                restitution={0.3}
                linearDamping={0.1}
                angularDamping={0.2}
              />
              <Collision type="box" halfExtents={[0.5, 0.5, 0.5]} />
              <Script script={ClickForceScript} />
            </Entity>

            {/* Eyes - two spheres */}
            <Entity
              position={[-0.2, 0.15, 0.5]}
              scale={[0.15 * head.scale, 0.15 * head.scale, 0.15 * head.scale]}
            >
              <Render type="sphere" />
            </Entity>
            <Entity
              position={[0.2, 0.15, 0.5]}
              scale={[0.15 * head.scale, 0.15 * head.scale, 0.15 * head.scale]}
            >
              <Render type="sphere" />
            </Entity>

            {/* Antenna - cylinder */}
            <Entity
              position={[0, 0.6, 0]}
              rotation={[0, 0, 0]}
              scale={[0.08 * head.scale, 0.3 * head.scale, 0.08 * head.scale]}
            >
              <Render type="cylinder" />
            </Entity>

            {/* Antenna ball */}
            <Entity
              position={[0, 0.9, 0]}
              scale={[0.12 * head.scale, 0.12 * head.scale, 0.12 * head.scale]}
            >
              <Render type="sphere" />
            </Entity>

            {/* Mouth/panel - small box */}
            <Entity
              position={[0, -0.2, 0.45]}
              scale={[0.3 * head.scale, 0.1 * head.scale, 0.1 * head.scale]}
            >
              <Render type="box" />
            </Entity>

            {/* Ears - two boxes */}
            <Entity
              position={[-0.6, 0, 0]}
              scale={[0.15 * head.scale, 0.3 * head.scale, 0.15 * head.scale]}
            >
              <Render type="box" />
            </Entity>
            <Entity
              position={[0.6, 0, 0]}
              scale={[0.15 * head.scale, 0.3 * head.scale, 0.15 * head.scale]}
            >
              <Render type="box" />
            </Entity>
          </Entity>
        ))}

        {/* Ground plane - large enough to catch all heads */}
        <Entity position={[0, -5, 0]} rotation={[-90, 0, 0]}>
          <Render type="plane" receiveShadows />
          <RigidBody type="static" />
          <Collision type="box" halfExtents={[25, 25, 0.5]} />
        </Entity>

        {/* Side walls to keep heads in bounds */}
        <Entity position={[0, 5, -8]} rotation={[0, 0, 0]}>
          <RigidBody type="static" />
          <Collision type="box" halfExtents={[15, 15, 0.5]} />
        </Entity>

        <Entity position={[0, 5, 8]} rotation={[0, 0, 0]}>
          <RigidBody type="static" />
          <Collision type="box" halfExtents={[15, 15, 0.5]} />
        </Entity>

        <Entity position={[-10, 5, 0]} rotation={[0, 90, 0]}>
          <RigidBody type="static" />
          <Collision type="box" halfExtents={[15, 15, 0.5]} />
        </Entity>

        <Entity position={[10, 5, 0]} rotation={[0, 90, 0]}>
          <RigidBody type="static" />
          <Collision type="box" halfExtents={[15, 15, 0.5]} />
        </Entity>
      </Application>
    </div>
  );
}
