"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { PhysicsLoader } from "./PhysicsLoader";

const PlayCanvasScene = dynamic(() => import("./PlayCanvasScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-[#7fff00] text-sm font-light tracking-widest uppercase">
        Loading 3D Experience...
      </div>
    </div>
  ),
});

export default function PlayCanvasHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* PlayCanvas 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <PhysicsLoader>
          <PlayCanvasScene />
        </PhysicsLoader>
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-2 border border-[#7fff00] px-4 py-2 mb-8"
          >
            <span className="text-xs font-light tracking-widest uppercase text-[#7fff00]">
              AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-extralight mb-8 text-white tracking-tight"
          >
            Transform
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-3xl md:text-5xl font-light mb-12 text-white/60"
          >
            Business.{" "}
            <span className="text-[#7fff00] font-normal">Intelligence</span>.
            Solutions.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto font-light"
          >
            Harness the power of cutting-edge AI to revolutionize your business.
            From machine learning to automation, we build intelligent solutions
            that drive real results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#contact"
              className="group bg-[#7fff00] text-black px-8 py-4 text-sm font-light tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-3"
            >
              Consult
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#services"
              className="bg-transparent text-white px-8 py-4 text-sm font-light tracking-widest uppercase border border-white hover:bg-white hover:text-black transition-colors"
            >
              Explore
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-20"
          >
            <div className="text-white/30 text-xs font-light tracking-widest uppercase">
              Scroll
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-[#7fff00] to-transparent mx-auto mt-4" />
          </motion.div>
        </div>
      </div>

      {/* Gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
    </section>
  );
}
