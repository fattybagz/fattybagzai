"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Code, Zap, Target, Sparkles as SparklesIcon, Rocket, ExternalLink, FileCode } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

const experience = [
  {
    icon: SparklesIcon,
    title: "Chief Marketing Officer",
    company: "Olympus DAO",
    period: "2024 – Present",
    badge: "Current",
    achievements: [
      "Direct global marketing for one of DeFi's most resilient protocols",
      "Lead brand narrative and ecosystem storytelling",
      "Oversee strategic partnerships and live activations",
    ],
    fullDescription: "Leading global marketing and communications strategy for one of DeFi's most influential protocols. Directing brand narrative development, ecosystem storytelling, and market positioning across institutional and retail channels.",
    detailedAchievements: [
      "Direct global marketing and communications strategy for one of DeFi's most resilient protocols",
      "Lead brand narrative development, ecosystem storytelling, and market positioning across institutional and retail channels",
      "Oversee strategic partnerships, PR, and live activations to expand awareness of Olympus' evolving on-chain monetary framework",
      "Coordinate cross-departmental collaboration to align community, product, and engineering initiatives under a unified brand vision",
    ],
    skills: ["Brand Strategy", "DeFi Marketing", "Community Management", "Strategic Partnerships", "Content Strategy"],
  },
  {
    icon: Code,
    title: "Founder & Lead Engineer",
    company: "VibeCoders LLC / Wraith Works LLC",
    period: "2022 – Present",
    badge: "Current",
    achievements: [
      "Architect AI pipelines using OpenAI, Claude, LLaMA 3 with ChromaDB",
      "Design multi-agent frameworks for creative automation",
      "Build full-stack infrastructure: Node.js, PostgreSQL, Redis, Docker",
    ],
    fullDescription: "Provide end-to-end AI, automation, and marketing consultation for Web3 and Web2 companies. Architect custom AI pipelines using LLMs with retrieval systems and orchestration through n8n and BullMQ.",
    detailedAchievements: [
      "Provide end-to-end AI, automation, and marketing consultation for Web3 and Web2 companies",
      "Architect custom AI pipelines using LLMs (OpenAI, Claude, Mistral, LLaMA 3) with retrieval systems via ChromaDB and orchestration through n8n and BullMQ",
      "Design multi-agent frameworks for creative automation, data analysis, and operational scalability",
      "Build full-stack infrastructure with Node.js, Fastify, PostgreSQL, and Redis, containerized with Docker",
      "Lead audio design and music production consulting, specializing in brand sound identity, film scoring, and adaptive product sound design",
      "Create real-time automation workflows linking Notion, Slack, Jira, Telegram, and Discord for streamlined operations",
      "Deliver comprehensive client systems merging AI-driven insight, marketing precision, and multimedia integration",
    ],
    skills: ["AI Engineering", "LLM Orchestration", "Full-Stack Development", "Audio Production", "Automation"],
  },
  {
    icon: Brain,
    title: "Creative Director, Audio Engineer & Multimedia Producer",
    company: "Independent Projects",
    period: "2019 – Present",
    badge: "Current",
    achievements: [
      "Produced cinematic video treatments and AI-assisted creative works",
      "Designed and edited viral content surpassing 22M+ views",
      "Composed, engineered, and mastered original music for commercial use",
    ],
    fullDescription: "Produced cinematic video treatments, protocol campaigns, and AI-assisted creative works across DeFi, entertainment, and marketing sectors. Designed and edited viral content combining storytelling, branding, and cutting-edge visuals.",
    detailedAchievements: [
      "Produced cinematic video treatments, protocol campaigns, and AI-assisted creative works across DeFi, entertainment, and marketing sectors",
      "Designed and edited viral content surpassing 22M+ views, combining storytelling, branding, and cutting-edge visuals",
      "Composed, engineered, and mastered original music for commercial use, soundtracks, and branded content",
      "Delivered end-to-end production pipelines including storyboarding, directing, mixing, mastering, and VFX post-production",
      "Developed and released creative tools including Sleep Buddy (binaural beat app) and DeStamp (viral meme composer)",
      "Consulted on AI-driven audio engineering and adaptive sound synthesis, integrating machine learning into compositional workflows",
    ],
    skills: ["Audio Production", "Video Editing", "Music Composition", "VFX", "Creative Direction"],
  },
  {
    icon: Rocket,
    title: "Community Host & Event Producer",
    company: "Railgun Protocol, Olympus DAO, Independent X Show",
    period: "2022 – 2024",
    badge: "Contract",
    achievements: [
      "Planned and hosted large-scale Twitter Spaces and live events",
      "Produced educational content on privacy and decentralization",
      "Directed live events with hundreds of attendees",
    ],
    fullDescription: "Planned and hosted large-scale Twitter Spaces and live events for Railgun Protocol and Olympus DAO, while producing and hosting an independent X Space series running for over a year.",
    detailedAchievements: [
      "Planned and hosted large-scale Twitter Spaces and live events for Railgun Protocol and Olympus DAO",
      "Produced educational and narrative-driven content on privacy, decentralization, and on-chain innovation, distributed across major Web3 media channels",
      "Directed live events with hundreds of attendees, managing technical execution, guest coordination, and promotional strategy",
      "Developed and implemented AI-assisted audience analytics tools to refine engagement cadence and optimize audience retention",
    ],
    skills: ["Event Production", "Community Management", "Content Creation", "Analytics"],
  },
  {
    icon: Target,
    title: "International Artist & NFT Pioneer",
    company: "Apeliens Collection",
    period: "2021 – 2024",
    badge: "Creator",
    achievements: [
      "Created Apeliens, a hand-drawn, surreal 1-of-1 NFT collection",
      "Earned over $600K in total NFT sales, including a $100K record sale",
      "Pioneered the auction-based minting model",
    ],
    fullDescription: "Created Apeliens, a hand-drawn, surreal 1-of-1 NFT collection that pioneered the auction-based minting model adopted across multiple NFT ecosystems. Earned over $600K in total NFT sales.",
    detailedAchievements: [
      "Created Apeliens, a hand-drawn, surreal 1-of-1 NFT collection that pioneered the auction-based minting model",
      "Earned over $600K in total NFT sales, including a record-breaking $100K single sale",
      "Designed worldbuilding centered on surrealism, myth, and digital identity, integrating on-chain verification and collector engagement",
      "Championed the artist-owned, 1-of-1 movement, influencing NFT market standards and community-driven ownership culture",
    ],
    skills: ["Digital Art", "NFT Creation", "Community Building", "Blockchain"],
  },
  {
    icon: Zap,
    title: "Community Partnership & Event Host",
    company: "Reddit Collectible Avatars",
    period: "2022 – 2023",
    badge: "Partnership",
    achievements: [
      "One of seven selected flagship artists for Reddit Collectable Avatars",
      "Collaborated with Reddit's Collectible Avatar and Blockchain Teams",
      "Art showcased in Times Square, NYC",
    ],
    fullDescription: "One of seven selected artists to be flagship artist for Reddit Collectable Avatars. Collaborated with Reddit's Collectible Avatar and Blockchain Teams to support integration and marketing strategy.",
    detailedAchievements: [
      "One of seven selected flagship artists for Reddit Collectable Avatars program",
      "Collaborated with Reddit's Collectible Avatar and Blockchain Teams to support integration and marketing strategy",
      "Produced and hosted official Reddit X (Twitter) Spaces, managing live interviews and educational content",
      "Led community rollout and audience engagement for Reddit's NFT and blockchain initiatives, bridging traditional and Web3 communities",
      "Art showcased in Times Square, NYC, through Reddit's global Collectible Avatar campaign",
    ],
    skills: ["Partnership Management", "Brand Collaboration", "Event Hosting", "Community Engagement"],
  },
  {
    icon: Brain,
    title: "Chief Marketing Officer",
    company: "Olympus DAO (First Tenure)",
    period: "2021 – 2022",
    badge: "Leadership",
    achievements: [
      "Scaled protocol from $12M to $4.3B market cap in 3 months",
      "Designed and executed brand-defining campaigns",
      "Led team of 25+ across creative, engineering, and analytics",
    ],
    fullDescription: "Directed marketing and communications for a top-10 DeFi protocol. Oversaw Olympus' rapid growth from $12M to $4.3B market cap in under three months, driving coordination across creative, engineering, analytics, and community teams.",
    detailedAchievements: [
      "Directed marketing and communications for a top-10 DeFi protocol",
      "Oversaw Olympus' rapid growth from $12M to $4.3B market cap in under three months",
      "Designed and executed brand-defining campaigns including Cooler Loans, Convertible Deposits, and The Monetary Computer",
      "Integrated automation infrastructure using Notion, n8n, Slack, and Discord to unify DAO-wide communication",
      "Regularly hosted Twitter Spaces, live AMAs, and protocol briefings, strengthening community engagement",
    ],
    skills: ["Marketing Strategy", "Team Leadership", "Campaign Management", "DAO Operations"],
  },
];

interface ServicesProps {
  onCompileResume?: () => void;
}

export default function Services({ onCompileResume }: ServicesProps) {
  const handleCompileResume = () => {
    if (onCompileResume) {
      onCompileResume();
    }
  };

  return (
    <>
      <section id="experience" className="py-20 bg-black border-t border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-6 relative py-8">
              <div className="relative inline-block">
                {/* Floating Particles */}
                {[...Array(15)].map((_, i) => {
                  const angle = (i / 15) * Math.PI * 2;
                  const baseRadius = 120;
                  const radiusVariation = 40;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full pointer-events-none"
                      style={{
                        left: "50%",
                        top: "50%",
                        marginLeft: "-4px",
                        marginTop: "-4px",
                        background: "radial-gradient(circle, #d8ff00 0%, transparent 70%)",
                        boxShadow: "0 0 8px 2px rgba(216, 255, 0, 0.8)",
                      }}
                      animate={{
                        x: [
                          Math.cos(angle) * baseRadius,
                          Math.cos(angle + Math.PI / 3) * (baseRadius + radiusVariation),
                          Math.cos(angle + Math.PI * 2 / 3) * baseRadius,
                          Math.cos(angle + Math.PI) * (baseRadius - radiusVariation * 0.5),
                          Math.cos(angle + Math.PI * 4 / 3) * baseRadius,
                          Math.cos(angle + Math.PI * 5 / 3) * (baseRadius + radiusVariation),
                          Math.cos(angle + Math.PI * 2) * baseRadius,
                        ],
                        y: [
                          Math.sin(angle) * 30,
                          Math.sin(angle + Math.PI / 3) * 50,
                          Math.sin(angle + Math.PI * 2 / 3) * 30,
                          Math.sin(angle + Math.PI) * 20,
                          Math.sin(angle + Math.PI * 4 / 3) * 30,
                          Math.sin(angle + Math.PI * 5 / 3) * 50,
                          Math.sin(angle + Math.PI * 2) * 30,
                        ],
                        opacity: [0.3, 1, 0.6, 0.9, 0.4, 1, 0.3],
                        scale: [0.8, 1.3, 0.9, 1.2, 0.8, 1.4, 0.8],
                      }}
                      transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4,
                      }}
                    />
                  );
                })}
                
                <motion.button
                  onClick={handleCompileResume}
                  className="relative bg-[#d8ff00] text-black px-8 py-4 font-black text-base uppercase tracking-tight flex items-center gap-3 rounded-[5px] z-10 shadow-lg shadow-[#d8ff00]/30 border-0 outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: "0 0 20px 5px rgba(216, 255, 0, 0.3), 0 0 40px 10px rgba(216, 255, 0, 0.2)",
                  }}
                >
                  {/* Pulsing Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-[5px] -z-10"
                    animate={{
                      boxShadow: [
                        "0 0 20px 5px rgba(216, 255, 0, 0.3), 0 0 40px 10px rgba(216, 255, 0, 0.2)",
                        "0 0 30px 8px rgba(216, 255, 0, 0.5), 0 0 60px 15px rgba(216, 255, 0, 0.3)",
                        "0 0 20px 5px rgba(216, 255, 0, 0.3), 0 0 40px 10px rgba(216, 255, 0, 0.2)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  <FileCode className="w-5 h-5" />
                  <span>Compile into Resume</span>
                  <SparklesIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-3 text-white tracking-tight">
              Experience
            </h2>
            <p className="text-sm font-bold text-white/70 max-w-2xl mx-auto">
              Building the Future of AI, DeFi & Creative Technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experience.map((job, index) => (
              <motion.div
                key={job.title + job.period}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="h-full border-white/10 hover:border-[#d8ff00]/50 transition-all duration-500 relative overflow-hidden cursor-pointer">
                      {/* Animated Gradient Background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#d8ff00]/10 via-[#d8ff00]/5 to-transparent"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Scan Line Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d8ff00]/20 to-transparent"
                        initial={{ y: "-100%" }}
                        whileHover={{ y: "100%" }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />

                      {/* Click Indicator */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <ExternalLink size={16} className="text-[#d8ff00]" />
                      </div>

                      <CardHeader className="relative z-10 p-4 pb-2">
                        <div className="flex items-start justify-between mb-3">
                          <motion.div
                            className="w-10 h-10 flex items-center justify-center border-2 border-white/20 group-hover:border-[#d8ff00] transition-colors duration-300"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <job.icon
                              size={20}
                              className="text-white group-hover:text-[#d8ff00] transition-colors"
                            />
                          </motion.div>
                          <Badge variant="secondary" className="text-[9px] px-2 py-0.5">
                            {job.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-bold tracking-tight text-white mb-1">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-white/80 mb-1">
                          {job.company}
                        </CardDescription>
                        <div className="text-[10px] text-[#d8ff00] font-mono font-semibold">
                          {job.period}
                        </div>
                      </CardHeader>

                      <CardContent className="relative z-10 p-4 pt-2">
                        <div className="space-y-1.5 mb-3">
                          {job.achievements.map((achievement, i) => (
                            <motion.div
                              key={achievement}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + i * 0.05 }}
                              className="flex items-start gap-1.5 text-[10px] text-white/70 leading-snug"
                            >
                              <div className="w-1 h-1 bg-[#d8ff00] rounded-full mt-1.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Click to Learn More - Transforms to Button on Hover */}
                        <div className="pt-3 border-t border-white/10">
                          <div className="text-[9px] text-[#d8ff00] uppercase tracking-wider font-semibold group-hover:bg-[#d8ff00] group-hover:text-black group-hover:px-3 group-hover:py-1.5 group-hover:rounded-[5px] inline-block transition-all duration-300 cursor-pointer">
                            Click to view details
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 flex items-center justify-center border-2 border-[#d8ff00] bg-[#d8ff00]/10">
                          <job.icon size={32} className="text-[#d8ff00]" />
                        </div>
                        <div className="flex-1">
                          <DialogTitle className="text-2xl mb-2">{job.title}</DialogTitle>
                          <DialogDescription className="text-base mb-1">
                            {job.company}
                          </DialogDescription>
                          <div className="flex gap-2 items-center">
                            <span className="text-xs text-[#d8ff00] font-mono font-semibold">
                              {job.period}
                            </span>
                            <Badge variant="secondary" className="text-[10px]">
                              {job.badge}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Full Description */}
                      <div>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {job.fullDescription}
                        </p>
                      </div>

                      {/* Detailed Achievements */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                          Key Achievements
                        </h4>
                        <div className="space-y-3">
                          {job.detailedAchievements.map((achievement, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3 text-sm text-white/70"
                            >
                              <div className="w-1.5 h-1.5 bg-[#d8ff00] rounded-full mt-2 flex-shrink-0" />
                              <span>{achievement}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                          Skills & Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
