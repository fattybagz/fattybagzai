"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SparklesCore } from "@/components/ui/sparkles";

const skillCategories = [
  {
    category: "AI & Automation",
    skills: [
      "LLM Orchestration",
      "Multi-Agent Systems",
      "ChromaDB",
      "TensorRT",
      "n8n",
      "BullMQ",
      "OpenAI",
      "Claude",
      "LLaMA 3",
    ],
    color: "from-[#7fff00]/20 to-[#7fff00]/5",
  },
  {
    category: "Full-Stack Development",
    skills: [
      "Node.js",
      "React",
      "TypeScript",
      "Fastify",
      "Express",
      "PostgreSQL",
      "Redis",
      "Docker",
      "AWS",
    ],
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    category: "Audio & Creative Production",
    skills: [
      "Ableton Live",
      "Pro Tools",
      "Sound Design",
      "Mixing & Mastering",
      "After Effects",
      "Premiere Pro",
      "Photoshop",
    ],
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    category: "Blockchain & DeFi",
    skills: [
      "Ethereum",
      "Solana",
      "Polygon",
      "Gnosis Safe",
      "Smart Contracts",
      "DeFi Systems",
      "Web3.js",
    ],
    color: "from-orange-500/20 to-orange-500/5",
  },
  {
    category: "Marketing & Strategy",
    skills: [
      "DAO Scaling",
      "GTM Architecture",
      "Community Strategy",
      "Brand Narrative",
      "Analytics",
      "PR & Events",
    ],
    color: "from-pink-500/20 to-pink-500/5",
  },
  {
    category: "Tools & Platforms",
    skills: [
      "Notion",
      "Jira",
      "Slack",
      "Discord",
      "Telegram",
      "Zapier",
      "Fusion 360",
    ],
    color: "from-cyan-500/20 to-cyan-500/5",
  },
];

export default function Skills() {
  return (
    <section className="py-20 bg-black border-t border-white/10 relative overflow-hidden">
      {/* Sparkles Background */}
      <div className="absolute inset-0">
        <SparklesCore
          id="skills-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#d8ff00"
          speed={3}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-white tracking-tight">
            Skills & Expertise
          </h2>
          <p className="text-base font-bold text-white/70 max-w-2xl mx-auto">
            Multidisciplinary Mastery Across Technology, Creative & Strategy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <Card className="h-full border-white/10 hover:border-[#d8ff00]/30 transition-all duration-500 relative overflow-hidden group">
                {/* Category Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <CardContent className="p-6 relative z-10">
                  <motion.h3
                    className="text-lg font-semibold text-white mb-4 tracking-wide"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.category}
                  </motion.h3>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: categoryIndex * 0.1 + skillIndex * 0.03,
                          type: "spring",
                          stiffness: 200,
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2.5 py-1 border-white/30 hover:border-[#d8ff00] hover:bg-[#d8ff00]/10 hover:text-[#d8ff00] transition-all cursor-default font-medium"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

