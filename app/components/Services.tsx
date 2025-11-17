"use client";

import { motion } from "framer-motion";
import { Brain, Code, Zap, Target, Sparkles, Rocket } from "lucide-react";
import dynamic from "next/dynamic";
import { PhysicsLoader } from "./PhysicsLoader";

const PlayCanvasServiceScene = dynamic(
  () => import("./PlayCanvasServiceScene"),
  {
    ssr: false,
  }
);

const services = [
  {
    icon: Brain,
    title: "AI Strategy & Consulting",
    description:
      "Strategic guidance to integrate AI into your business operations and unlock new opportunities.",
    variant: "ai" as const,
  },
  {
    icon: Code,
    title: "Custom AI Development",
    description:
      "Tailored AI solutions built from scratch to address your unique business challenges.",
    variant: "ai" as const,
  },
  {
    icon: Zap,
    title: "Machine Learning Models",
    description:
      "Advanced ML models that learn from your data and improve over time.",
    variant: "analytics" as const,
  },
  {
    icon: Target,
    title: "Automation Solutions",
    description:
      "Streamline workflows and boost productivity with intelligent automation.",
    variant: "automation" as const,
  },
  {
    icon: Sparkles,
    title: "Natural Language Processing",
    description:
      "Build conversational AI, chatbots, and language understanding systems.",
    variant: "ai" as const,
  },
  {
    icon: Rocket,
    title: "AI Integration",
    description:
      "Seamlessly integrate cutting-edge AI tools into your existing infrastructure.",
    variant: "automation" as const,
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extralight mb-4 text-white">
            Services
          </h2>
          <p className="text-sm font-light tracking-wide text-white/40 max-w-2xl mx-auto uppercase">
            Comprehensive solutions for growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group border border-white/10 hover:border-[#7fff00]/50 transition-all overflow-hidden relative"
            >
              {/* 3D Background */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                <PhysicsLoader>
                  <PlayCanvasServiceScene variant={service.variant} />
                </PhysicsLoader>
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 bg-gradient-to-b from-black/60 to-black/90">
                <div className="w-12 h-12 flex items-center justify-center mb-6 border border-white/20 group-hover:border-[#7fff00] transition-colors">
                  <service.icon
                    size={24}
                    className="text-white group-hover:text-[#7fff00] transition-colors"
                  />
                </div>
                <h3 className="text-lg font-light mb-3 text-white tracking-wide">
                  {service.title}
                </h3>
                <p className="text-xs font-light text-white/50 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
