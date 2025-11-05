"use client";

import { motion } from "framer-motion";
import { Brain, Code, Zap, Target, Sparkles, Rocket } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Strategy & Consulting",
    description:
      "Strategic guidance to integrate AI into your business operations and unlock new opportunities.",
  },
  {
    icon: Code,
    title: "Custom AI Development",
    description:
      "Tailored AI solutions built from scratch to address your unique business challenges.",
  },
  {
    icon: Zap,
    title: "Machine Learning Models",
    description:
      "Advanced ML models that learn from your data and improve over time.",
  },
  {
    icon: Target,
    title: "Automation Solutions",
    description:
      "Streamline workflows and boost productivity with intelligent automation.",
  },
  {
    icon: Sparkles,
    title: "Natural Language Processing",
    description:
      "Build conversational AI, chatbots, and language understanding systems.",
  },
  {
    icon: Rocket,
    title: "AI Integration",
    description:
      "Seamlessly integrate cutting-edge AI tools into your existing infrastructure.",
  },
];

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            What We Offer
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive AI solutions designed to drive innovation and growth
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
              className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
