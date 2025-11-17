"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const CursorParticleField = dynamic(() => import("./CursorParticleField"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black pt-20 overflow-hidden">
      {/* Cursor-Reactive Particle Field */}
      <div className="absolute inset-0 w-full h-full opacity-70 pointer-events-none">
        <CursorParticleField />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-[#7fff00] px-4 py-2 mb-8"
          >
            <span className="text-xs font-light tracking-widest uppercase text-[#7fff00]">
              AI
            </span>
          </motion.div>

          {/* Headline - Modern minimalist */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extralight mb-6 text-white tracking-tight"
          >
            Transform
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-light mb-12 text-white/60"
          >
            Business. <span className="chartreuse-accent">Intelligence</span>.
            Solutions.
          </motion.h2>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
              href="/portfolio"
              className="bg-transparent text-white px-8 py-4 text-sm font-light tracking-widest uppercase border border-white hover:bg-white hover:text-black transition-colors"
            >
              Work
            </a>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { label: "Innovation", value: "100%" },
              { label: "Satisfaction", value: "95+%" },
              { label: "Delivered", value: "50+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="border border-white/10 p-6 hover:border-[#7fff00]/50 transition-colors"
              >
                <div className="text-4xl font-extralight text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-xs font-light tracking-widest uppercase text-white/40">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
