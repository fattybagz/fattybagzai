"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SingularityShaders } from "@/components/ui/singularity-shaders";
import { useEffect, useRef, useState } from "react";

export default function PlayCanvasHero() {
  const { scrollY } = useScroll();
  const hasAutoScrolled = useRef(false);
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    scale: number;
    duration: number;
    delay: number;
  }>>([]);

  // Generate particle positions only on client side to avoid hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);
  
  // Transform values for hero scaling and opacity based on scroll - more dramatic
  const scale = useTransform(scrollY, [0, 400], [1, 0]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, -200]);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // If user scrolls past 200px and hasn't auto-scrolled yet
      if (latest > 200 && !hasAutoScrolled.current) {
        hasAutoScrolled.current = true;
        
        // Auto-scroll to experience section with perfect animation
        const experienceSection = document.getElementById("experience");
        if (experienceSection) {
          const targetPosition = experienceSection.offsetTop;
          const startPosition = window.scrollY;
          const distance = targetPosition - startPosition;
          const duration = 1000; // 1 second smooth animation
          const startTime = performance.now();
          
          // Smooth ease-out function
          const easeOutCubic = (t: number): number => {
            return 1 - Math.pow(1 - t, 3);
          };
          
          const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * eased);
            
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            } else {
              // Ensure we land exactly on the target
              window.scrollTo(0, targetPosition);
            }
          };
          
          requestAnimationFrame(animateScroll);
        }
      }
      
      // Reset flag if user scrolls back to top
      if (latest < 100) {
        hasAutoScrolled.current = false;
      }
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Singularity Shader Background */}
      <div className="absolute inset-0">
        <SingularityShaders
          speed={0.8}
          intensity={1.5}
          size={0.9}
          waveStrength={1.2}
          colorShift={1.3}
          mouseInteractive={true}
          className="w-full h-full"
        />
      </div>


      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#d8ff00] rounded-full"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              scale: particle.scale,
              opacity: 0,
            }}
            animate={{
              y: [null, `${particle.y - 20}%`],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <motion.div 
        className="container mx-auto px-6 py-20 relative z-10"
        style={{ scale, opacity, y }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-white tracking-tighter relative"
          >
            <span className="relative inline-block">
              Atlas Ward
              <motion.span
                className="absolute -inset-1 bg-[#d8ff00]/20 blur-xl -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-4xl mx-auto font-bold leading-tight"
          >
            Scaling protocols from <span className="text-[#d8ff00]">$12M to $4.3B</span>.
            Building AI systems that automate the future.
            Creating art that defines digital culture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#contact"
              className="group bg-[#d8ff00] text-black px-10 py-4 text-base font-black tracking-tight uppercase hover:bg-[#d8ff00]/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#d8ff00]/30 rounded-[5px]"
            >
              Contact Me
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="https://x.com/fattybagz"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-white px-10 py-4 text-base font-bold tracking-tight uppercase border-2 border-white/30 hover:border-[#d8ff00] hover:text-[#d8ff00] transition-colors rounded-[5px]"
            >
              Follow on X
            </a>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: "$4.3B", label: "Market Cap Scaled" },
              { value: "$600K+", label: "NFT Sales" },
              { value: "22M+", label: "Views Generated" },
              { value: "5+ Years", label: "Web3 Leadership" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="border border-white/10 group-hover:border-[#d8ff00]/50 transition-all duration-300 p-4 bg-black/20 backdrop-blur-sm">
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-[#d8ff00] mb-1"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(216,255,0,0.3)",
                        "0 0 20px rgba(216,255,0,0.6)",
                        "0 0 10px rgba(216,255,0,0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-3"
            >
              <div className="text-white/50 text-xs font-medium tracking-widest uppercase">
                Scroll to Explore
              </div>
              <div className="w-px h-16 bg-gradient-to-b from-[#d8ff00] to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
    </section>
  );
}
