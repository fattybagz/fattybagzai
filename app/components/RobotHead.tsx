'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';

// Professional Hyper-Realistic AI Robot Head
function ProfessionalRobot({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  // Iridescent chrome material for main head - creates psychedelic rainbow effect
  const chromeHeadMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      metalness: 1.0,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1,
      envMapIntensity: 2.5,
      // Iridescence creates the psychedelic rainbow effect
      iridescence: 1.0,
      iridescenceIOR: 2.4,
      iridescenceThicknessRange: [100, 800],
    });
  }, []);

  // Dark glossy panel material
  const panelMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0f0f23'),
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.8,
    });
  }, []);

  // Glowing energy material for eyes and accents
  const energyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00ffff'),
      emissive: new THREE.Color('#00ffff'),
      emissiveIntensity: 3,
      metalness: 0.3,
      roughness: 0.2,
      transmission: 0.4,
      thickness: 0.5,
    });
  }, []);

  // Smooth cursor following animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const targetRotationY = mousePosition.x * 0.4;
      const targetRotationX = mousePosition.y * 0.25;
      
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    }

    // Subtle floating animation
    if (headRef.current) {
      headRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.08;
      headRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Robot Head - Iridescent Chrome Sphere */}
      <mesh ref={headRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 128, 128]} />
        <primitive object={chromeHeadMaterial} attach="material" />
      </mesh>

      {/* Face Panel - Dark glossy surface */}
      <mesh position={[0, 0.05, 0.92]} castShadow>
        <boxGeometry args={[1.3, 1.5, 0.08]} />
        <primitive object={panelMaterial} attach="material" />
      </mesh>

      {/* Left Eye Assembly */}
      <group position={[-0.32, 0.22, 1.0]}>
        {/* Eye outer glow */}
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.4} 
            side={THREE.BackSide}
          />
        </mesh>
        {/* Main eye orb */}
        <mesh>
          <sphereGeometry args={[0.16, 32, 32]} />
          <primitive object={energyMaterial} attach="material" />
        </mesh>
        {/* Pupil/Iris */}
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshPhysicalMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={2}
            metalness={1}
            roughness={0}
          />
        </mesh>
      </group>

      {/* Right Eye Assembly */}
      <group position={[0.32, 0.22, 1.0]}>
        {/* Eye outer glow */}
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.4} 
            side={THREE.BackSide}
          />
        </mesh>
        {/* Main eye orb */}
        <mesh>
          <sphereGeometry args={[0.16, 32, 32]} />
          <primitive object={energyMaterial} attach="material" />
        </mesh>
        {/* Pupil/Iris */}
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshPhysicalMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={2}
            metalness={1}
            roughness={0}
          />
        </mesh>
      </group>

      {/* Forehead Sensor Bar */}
      <mesh position={[0, 0.65, 0.92]} castShadow>
        <boxGeometry args={[0.8, 0.12, 0.06]} />
        <meshPhysicalMaterial
          color="#9333ea"
          emissive="#9333ea"
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Top Sensor Array - Three glowing orbs */}
      <mesh position={[-0.45, 0.95, 0.25]} castShadow>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshPhysicalMaterial
          color="#ff00ff"
          metalness={1}
          roughness={0}
          envMapIntensity={2.5}
          emissive="#ff00ff"
          emissiveIntensity={1.2}
        />
      </mesh>

      <mesh position={[0, 1.05, 0.25]} castShadow>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffff00"
          metalness={1}
          roughness={0}
          envMapIntensity={2.5}
          emissive="#ffff00"
          emissiveIntensity={1.2}
        />
      </mesh>

      <mesh position={[0.45, 0.95, 0.25]} castShadow>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshPhysicalMaterial
          color="#00ff00"
          metalness={1}
          roughness={0}
          envMapIntensity={2.5}
          emissive="#00ff00"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Antenna Array - 12 rods in circular pattern */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 0.75;
        const height = 0.7 + (i % 3) * 0.15;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            {/* Antenna rod */}
            <mesh position={[radius, 0.85, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, height, 16]} />
              <meshPhysicalMaterial
                color="#6366f1"
                metalness={1}
                roughness={0.15}
                emissive="#6366f1"
                emissiveIntensity={0.4}
                envMapIntensity={2}
              />
            </mesh>
            {/* Tip orb */}
            <mesh position={[radius, 0.85 + height / 2, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color={i % 3 === 0 ? "#ec4899" : i % 3 === 1 ? "#fbbf24" : "#06b6d4"} />
            </mesh>
          </group>
        );
      })}

      {/* Lower Jaw Panel */}
      <mesh position={[0, -0.42, 0.88]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.35, 0.08]} />
        <primitive object={panelMaterial} attach="material" />
      </mesh>

      {/* Mouth Grill - Horizontal lines */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, -0.45 + i * 0.055, 0.92]} castShadow>
          <boxGeometry args={[0.7, 0.02, 0.02]} />
          <meshPhysicalMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Cheek Accent Panels - Iridescent strips */}
      <mesh position={[-0.68, 0.05, 0.72]} rotation={[0, -0.35, 0]} castShadow>
        <boxGeometry args={[0.28, 1.1, 0.08]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={1}
          roughness={0.05}
          iridescence={1.0}
          iridescenceIOR={1.9}
          iridescenceThicknessRange={[100, 400]}
          envMapIntensity={2.2}
        />
      </mesh>

      <mesh position={[0.68, 0.05, 0.72]} rotation={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.28, 1.1, 0.08]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={1}
          roughness={0.05}
          iridescence={1.0}
          iridescenceIOR={1.9}
          iridescenceThicknessRange={[100, 400]}
          envMapIntensity={2.2}
        />
      </mesh>

      {/* Energy Core - Glass sphere with transmission at center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={20}
          thickness={0.6}
          chromaticAberration={0.12}
          anisotropy={0.6}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.15}
          transmission={1}
          roughness={0}
          color="#9333ea"
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Inner Energy Orb - Glowing core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshPhysicalMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={4}
          metalness={0}
          roughness={0.2}
          transmission={0.6}
          thickness={0.4}
        />
      </mesh>

      {/* Floating Particle Field - Energy atmosphere */}
      {[...Array(60)].map((_, i) => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 1.6 + Math.random() * 0.7;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        const size = 0.015 + Math.random() * 0.025;
        const colorChoice = i % 3;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 12, 12]} />
            <meshBasicMaterial 
              color={colorChoice === 0 ? '#9333ea' : colorChoice === 1 ? '#ec4899' : '#06b6d4'} 
            />
          </mesh>
        );
      })}

      {/* Side Vents - Technical details */}
      {[-0.55, 0.55].map((xPos, idx) => (
        <group key={idx} position={[xPos, -0.15, 0.75]}>
          {[...Array(4)].map((_, i) => (
            <mesh key={i} position={[0, i * 0.08 - 0.12, 0]} rotation={[0, xPos < 0 ? -0.3 : 0.3, 0]}>
              <boxGeometry args={[0.15, 0.03, 0.03]} />
              <meshPhysicalMaterial
                color="#1a1a3e"
                metalness={0.9}
                roughness={0.3}
                emissive="#6366f1"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      ))}
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
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#0a0a0f', 5, 12]} />
        
        {/* HDR Environment for realistic reflections */}
        <Environment preset="city" />
        
        {/* Professional 3-Point Lighting Setup */}
        
        {/* Key Light - Main bright light from front-right */}
        <directionalLight 
          position={[4, 5, 4]} 
          intensity={2.5} 
          color="#ffffff" 
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={15}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />
        
        {/* Fill Light - Soft purple from left */}
        <pointLight position={[-4, 2, 3]} intensity={1.8} color="#9333ea" />
        
        {/* Rim/Back Light - Pink edge lighting from behind */}
        <pointLight position={[0, -4, -6]} intensity={2.2} color="#ec4899" />
        
        {/* Accent Lights - Cyan highlights */}
        <pointLight position={[3, 1, -2]} intensity={1.2} color="#06b6d4" />
        <pointLight position={[-3, -1, -2]} intensity={0.8} color="#fbbf24" />
        
        {/* Ambient base illumination */}
        <ambientLight intensity={0.25} color="#d4d4f0" />
        
        {/* Top Light - Overhead */}
        <pointLight position={[0, 6, 0]} intensity={1.5} color="#ffffff" />
        
        <ProfessionalRobot mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
