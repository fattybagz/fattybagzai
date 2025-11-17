"use client";

import { useEffect, useState } from "react";

// Global promise to prevent multiple simultaneous loads
let ammoLoadPromise: Promise<void> | null = null;

export function useAmmoLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAmmo() {
      try {
        // Check if Ammo is already fully loaded and initialized
        if (typeof window !== 'undefined' && (window as any).Ammo) {
          const Ammo = (window as any).Ammo;
          // Verify Ammo is fully initialized by checking for critical classes
          if (typeof Ammo.btVector3 === 'function' && 
              typeof Ammo.btCollisionWorld === 'function' &&
              typeof Ammo.btDefaultCollisionConfiguration === 'function') {
            console.log('✅ Ammo already fully initialized!');
            setIsLoaded(true);
            return;
          }
        }

        // If already loading, wait for that promise
        if (ammoLoadPromise) {
          console.log('⏳ Waiting for existing Ammo load...');
          await ammoLoadPromise;
          if (!cancelled) {
            setIsLoaded(true);
          }
          return;
        }

        console.log('⏳ Loading Ammo.js physics engine from CDN...');
        
        // Create the loading promise
        ammoLoadPromise = new Promise<void>(async (resolve, reject) => {
          try {
            // Check if script already exists
            const existingScript = document.querySelector('script[src*="ammo.js"]');
            if (existingScript && (window as any).Ammo) {
              const Ammo = (window as any).Ammo;
              if (typeof Ammo === 'function') {
                console.log('⏳ Initializing Ammo from existing script...');
                const AmmoLib = await Ammo();
                (window as any).Ammo = AmmoLib;
                console.log('✅ Ammo initialized from existing script!');
                resolve();
                return;
              } else if (typeof Ammo.btVector3 === 'function') {
                console.log('✅ Ammo already ready from existing script!');
                resolve();
                return;
              }
            }

            // Load Ammo.js from CDN
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/ammo.js@0.0.10/ammo.js';
            script.async = true;
            
            script.onload = async () => {
              console.log('⏳ Ammo.js script loaded, initializing...');
              
              try {
                // Wait for Ammo to be available
                let attempts = 0;
                while (attempts < 50 && typeof (window as any).Ammo !== 'function') {
                  await new Promise(r => setTimeout(r, 50));
                  attempts++;
                }
                
                if (typeof (window as any).Ammo !== 'function') {
                  reject(new Error('Ammo function not found after waiting'));
                  return;
                }
                
                console.log('⏳ Calling Ammo() to initialize...');
                const AmmoLib = await (window as any).Ammo();
                
                // Verify ALL critical classes exist
                const requiredClasses = [
                  'btVector3',
                  'btCollisionWorld', 
                  'btDefaultCollisionConfiguration',
                  'btCollisionDispatcher',
                  'btDbvtBroadphase',
                  'btSequentialImpulseConstraintSolver',
                  'btDiscreteDynamicsWorld',
                  'btBoxShape',
                  'btSphereShape',
                  'btDefaultMotionState',
                  'btRigidBody',
                  'btTransform',
                  'btQuaternion'
                ];
                
                const missingClasses = requiredClasses.filter(
                  className => typeof AmmoLib[className] !== 'function'
                );
                
                if (missingClasses.length > 0) {
                  reject(new Error(`Ammo missing classes: ${missingClasses.join(', ')}`));
                  return;
                }
                
                // Set global Ammo
                (window as any).Ammo = AmmoLib;
                
                // Extra verification delay
                await new Promise(r => setTimeout(r, 200));
                
                console.log('✅ Ammo.js fully initialized and verified!');
                resolve();
              } catch (initErr) {
                console.error('Ammo initialization error:', initErr);
                reject(initErr);
              }
            };
            
            script.onerror = () => {
              reject(new Error('Failed to load Ammo.js script from CDN'));
            };
            
            document.head.appendChild(script);
          } catch (err) {
            reject(err);
          }
        });

        await ammoLoadPromise;
        
        if (cancelled) return;

        console.log('✅ Ammo.js ready for PlayCanvas!');
        
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        ammoLoadPromise = null; // Reset on error so retry is possible
        if (cancelled) return;
        console.error('❌ Failed to load Ammo:', err);
        setError(err instanceof Error ? err : new Error('Failed to load Ammo.js'));
        setIsLoaded(false);
      }
    }

    loadAmmo();

    return () => {
      cancelled = true;
    };
  }, []);

  return { isLoaded, error };
}

export function PhysicsLoader({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const { isLoaded, error } = useAmmoLoader();
  const [isReady, setIsReady] = useState(false);

  // Add a delay after Ammo loads to ensure it's stable
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        // Final verification before rendering
        if (typeof (window as any).Ammo?.btVector3 === 'function') {
          setIsReady(true);
        } else {
          console.error('❌ Ammo not ready after load!');
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-red-500">
          Failed to load physics engine: {error.message}
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      fallback || (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-[#7fff00] text-sm font-light tracking-widest uppercase">
            Loading Physics Engine...
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
