"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Cpu, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompiledResumeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompiledResume({ isOpen, onClose }: CompiledResumeProps) {
  const [compilingPhase, setCompilingPhase] = React.useState(0);
  const [visibleSections, setVisibleSections] = React.useState<string[]>([]);
  
  // Store completed text and typing state to prevent re-typing
  const textStateRef = React.useRef<Map<string, { text: string; hasStarted: boolean; isComplete: boolean }>>(new Map());

  React.useEffect(() => {
    if (isOpen) {
      // Reset state
      setCompilingPhase(0);
      setVisibleSections([]);
      // Clear text state cache for fresh start
      textStateRef.current.clear();
      
      // Simulate compilation phases
      const phases = [
        { delay: 500, section: "header" },
        { delay: 1200, section: "summary" },
        { delay: 2200, section: "experience1" },
        { delay: 3500, section: "experience2" },
        { delay: 5000, section: "experience3" },
        { delay: 6500, section: "skills" },
        { delay: 8000, section: "highlights" },
      ];

      phases.forEach((phase, index) => {
        setTimeout(() => {
          setCompilingPhase(index + 1);
          setVisibleSections(prev => [...prev, phase.section]);
        }, phase.delay);
      });
    }
  }, [isOpen]);

  const TypewriterText = React.memo(({ text, delay = 0, sectionKey }: { text: string; delay?: number; sectionKey: string }) => {
    // Get or initialize persistent state from ref (never resets)
    const getState = () => {
      let state = textStateRef.current.get(sectionKey);
      if (!state) {
        state = { text: "", hasStarted: false, isComplete: false };
        textStateRef.current.set(sectionKey, state);
      }
      return state;
    };

    // Initialize displayed text from persistent ref state
    const state = getState();
    const [displayedText, setDisplayedText] = React.useState(state.text);
    
    // Use refs for all mutable state (never reset on re-render)
    const currentIndexRef = React.useRef(state.text.length);
    const hasStartedRef = React.useRef(state.hasStarted);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = React.useRef(true);
    const textRef = React.useRef(text);

    // Update text ref when it changes
    React.useEffect(() => {
      textRef.current = text;
    }, [text]);

    // Single effect to handle all typing logic (runs once per section)
    React.useEffect(() => {
      isMountedRef.current = true;
      const state = getState();
      const currentText = textRef.current;
      
      // If already completed, just display the text
      if (state.isComplete) {
        if (displayedText !== state.text) {
          setDisplayedText(state.text);
        }
        return;
      }
      
      // If already started, continue from where we left off
      if (state.hasStarted || hasStartedRef.current) {
        hasStartedRef.current = true;
        state.hasStarted = true;
        
        // Continue typing if not complete
        const continueTyping = () => {
          if (!isMountedRef.current) return;
          
          const currentState = getState();
          const currentText = textRef.current;
          if (currentState.isComplete || currentIndexRef.current >= currentText.length) {
            currentState.isComplete = true;
            return;
          }
          
          // Build text from start to current index (prevents duplication)
          const newText = currentText.substring(0, currentIndexRef.current + 1);
          currentIndexRef.current += 1;
          currentState.text = newText;
          
          if (newText.length >= currentText.length) {
            currentState.isComplete = true;
          }
          
          setDisplayedText(newText);
          
          if (currentIndexRef.current < currentText.length && isMountedRef.current) {
            timeoutRef.current = setTimeout(continueTyping, 15 + Math.random() * 20);
          }
        };
        
        if (currentIndexRef.current < textRef.current.length) {
          continueTyping();
        }
        return;
      }
      
      // Start typing after delay (only once)
      timeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        
        hasStartedRef.current = true;
        const currentState = getState();
        currentState.hasStarted = true;
        
        // Start typing
        const startTyping = () => {
          if (!isMountedRef.current) return;
          
          const currentState = getState();
          const currentText = textRef.current;
          if (currentState.isComplete || currentIndexRef.current >= currentText.length) {
            currentState.isComplete = true;
            return;
          }
          
          // Build text from start to current index (prevents duplication)
          const newText = currentText.substring(0, currentIndexRef.current + 1);
          currentIndexRef.current += 1;
          currentState.text = newText;
          
          if (newText.length >= currentText.length) {
            currentState.isComplete = true;
          }
          
          setDisplayedText(newText);
          
          if (currentIndexRef.current < currentText.length && isMountedRef.current) {
            timeoutRef.current = setTimeout(startTyping, 15 + Math.random() * 20);
          }
        };
        
        startTyping();
      }, delay);
      
      return () => {
        isMountedRef.current = false;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }, [sectionKey]); // Only depend on sectionKey - never restart for same section

    return <span>{displayedText}</span>;
  }, (prevProps, nextProps) => {
    // Only re-render if sectionKey changes (text can change but we persist state)
    return prevProps.sectionKey === nextProps.sectionKey;
  });
  
  TypewriterText.displayName = 'TypewriterText';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-8 max-w-5xl">
            {/* Header Controls */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{
                    rotate: compilingPhase < 7 ? 360 : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: compilingPhase < 7 ? Infinity : 0,
                    ease: "linear",
                  }}
                >
                  <Cpu className="w-6 h-6 text-[#d8ff00]" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {compilingPhase < 7 ? "Compiling Resume..." : "Resume Compiled"}
                  </h2>
                  <p className="text-sm text-white/60">
                    {compilingPhase < 7 ? "Building your professional profile" : "Ready to download"}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                {compilingPhase >= 7 && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#d8ff00] text-black px-6 py-3 font-bold flex items-center gap-2 hover:bg-[#d8ff00]/90 transition-all shadow-lg shadow-[#d8ff00]/20 rounded-[5px]"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </motion.button>
                )}
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors p-3"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </motion.div>

            {/* Compilation Progress */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: compilingPhase / 7 }}
              className="h-1 bg-[#d8ff00] mb-8 origin-left"
            />

            {/* Resume Content */}
            <Card className="border-[#d8ff00]/30 bg-black/50 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12 space-y-8">
                {/* Header Section */}
                {visibleSections.includes("header") && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="border-b border-white/10 pb-6"
                  >
                    <h1 className="text-5xl font-black text-white mb-2">
                      <TypewriterText text="ATLAS WARD" sectionKey="header-name" />
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                      <span><TypewriterText text="fattybagz@wraithworks.xyz" delay={500} sectionKey="header-email" /></span>
                      <span><TypewriterText text="•" delay={800} sectionKey="header-dot1" /></span>
                      <span><TypewriterText text="x.com/fattybagz" delay={900} sectionKey="header-x" /></span>
                      <span><TypewriterText text="•" delay={1200} sectionKey="header-dot2" /></span>
                      <span><TypewriterText text="+1 (682) 200-3494" delay={1300} sectionKey="header-phone" /></span>
                    </div>
                  </motion.div>
                )}

                {/* Summary Section */}
                {visibleSections.includes("summary") && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h2 className="text-2xl font-black text-[#d8ff00] mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <TypewriterText text="PROFESSIONAL SUMMARY" sectionKey="summary-title" />
                    </h2>
                    <p className="text-white/80 leading-relaxed text-base">
                      <TypewriterText 
                        text="Multidisciplinary executive and creative technologist at the forefront of AI innovation, blockchain strategy, and multimedia design. Recognized for building systems that bridge creativity and computation — where technology amplifies culture, and narrative drives adoption. Two-time Chief Marketing Officer of Olympus DAO, one of DeFi's most influential protocols. Played a key role in scaling Olympus from a $12M market cap to $4.3B in just three months (2021) through high-impact storytelling, data-backed marketing, and coordinated execution across 25+ team members and partner organizations. Founder of VibeCoders LLC, an AI and creative engineering consultancy delivering automation architecture, LLM systems, marketing intelligence, and professional audio design for leading Web3 and Web2 brands. Known for translating emerging tech into practical, profitable ecosystems that drive real-world outcomes. Internationally published artist, producer, and engineer with expertise spanning AI-driven media production, LLM pipeline development, brand sound design, and multi-agent creative systems. Hands-on leader dedicated to pushing the boundaries of what's possible between human creativity and machine intelligence."
                        sectionKey="summary-text"
                      />
                    </p>
                  </motion.div>
                )}

                {/* Experience Section - Part 1 */}
                {visibleSections.includes("experience1") && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h2 className="text-2xl font-black text-[#d8ff00] mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <TypewriterText text="PROFESSIONAL EXPERIENCE" sectionKey="experience-title" />
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Current CMO Role */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="border-l-2 border-[#d8ff00] pl-4"
                      >
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-white">Chief Marketing Officer</h3>
                            <p className="text-white/90 font-semibold">Olympus DAO</p>
                          </div>
                          <Badge variant="outline" className="text-xs bg-[#d8ff00]/10">2024 – Present</Badge>
                        </div>
                        <ul className="space-y-1.5 text-sm text-white/80 leading-relaxed">
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Direct global marketing and communications strategy for one of DeFi's most resilient protocols</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Lead brand narrative development, ecosystem storytelling, and market positioning across institutional and retail channels</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Oversee strategic partnerships, PR, and live activations to expand awareness of Olympus' evolving on-chain monetary framework</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Coordinate cross-departmental collaboration to align community, product, and engineering initiatives under a unified brand vision</span>
                          </li>
                        </ul>
                      </motion.div>

                      {/* VibeCoders Role */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="border-l-2 border-[#d8ff00]/60 pl-4"
                      >
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-white">Founder & Lead Engineer</h3>
                            <p className="text-white/90 font-semibold">VibeCoders LLC / Wraith Works LLC</p>
                          </div>
                          <Badge variant="outline" className="text-xs bg-[#d8ff00]/10">2022 – Present</Badge>
                        </div>
                        <ul className="space-y-1.5 text-sm text-white/80 leading-relaxed">
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Provide end-to-end AI, automation, and marketing consultation for Web3 and Web2 companies</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Architect custom AI pipelines using LLMs (OpenAI, Claude, Mistral, LLaMA 3) with retrieval systems via ChromaDB and orchestration through n8n and BullMQ</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Design multi-agent frameworks for creative automation, data analysis, and operational scalability</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Build full-stack infrastructure with Node.js, Fastify, PostgreSQL, and Redis, containerized with Docker</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Lead audio design and music production consulting, specializing in brand sound identity, film scoring, and adaptive product sound design</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Create real-time automation workflows linking Notion, Slack, Jira, Telegram, and Discord for streamlined operations</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                            <span>Deliver comprehensive client systems merging AI-driven insight, marketing precision, and multimedia integration</span>
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Experience Section - Part 2 */}
                {visibleSections.includes("experience2") && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Creative Director Role */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="border-l-2 border-[#d8ff00]/60 pl-4"
                    >
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">Creative Director, Audio Engineer & Multimedia Producer</h3>
                          <p className="text-white/90 font-semibold">Independent Projects</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-[#d8ff00]/10">2019 – Present</Badge>
                      </div>
                      <ul className="space-y-1.5 text-sm text-white/80 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Produced cinematic video treatments, protocol campaigns, and AI-assisted creative works across DeFi, entertainment, and marketing sectors</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Designed and edited viral content surpassing 22M+ views, combining storytelling, branding, and cutting-edge visuals</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Composed, engineered, and mastered original music for commercial use, soundtracks, and branded content</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Delivered end-to-end production pipelines including storyboarding, directing, mixing, mastering, and VFX post-production</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Developed and released creative tools including Sleep Buddy (binaural beat app) and DeStamp (viral meme composer)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Consulted on AI-driven audio engineering and adaptive sound synthesis, integrating machine learning into compositional workflows</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Community Host Role */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="border-l-2 border-[#d8ff00]/60 pl-4"
                    >
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">Community Host & Event Producer</h3>
                          <p className="text-white/90 font-semibold">Railgun Protocol, Olympus DAO, Independent X Show</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-[#d8ff00]/10">2022 – 2024</Badge>
                      </div>
                      <ul className="space-y-1.5 text-sm text-white/80 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Planned and hosted large-scale Twitter Spaces and live events for Railgun Protocol and Olympus DAO</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Produced educational and narrative-driven content on privacy, decentralization, and on-chain innovation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Directed live events with hundreds of attendees, managing technical execution, guest coordination, and promotional strategy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Developed and implemented AI-assisted audience analytics tools to refine engagement cadence and optimize retention</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* NFT Artist Role */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="border-l-2 border-[#d8ff00]/60 pl-4"
                    >
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">International Artist & NFT Pioneer</h3>
                          <p className="text-white/90 font-semibold">Apeliens Collection</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-[#d8ff00]/10">2021 – 2024</Badge>
                      </div>
                      <ul className="space-y-1.5 text-sm text-white/80 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Created Apeliens, a hand-drawn, surreal 1-of-1 NFT collection that pioneered the auction-based minting model</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Earned over $600K in total NFT sales, including a record-breaking $100K single sale</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Designed worldbuilding centered on surrealism, myth, and digital identity with on-chain verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Championed the artist-owned, 1-of-1 movement, influencing NFT market standards and community-driven ownership culture</span>
                        </li>
                      </ul>
                    </motion.div>
                  </motion.div>
                )}

                {/* Experience Section - Part 3 */}
                {visibleSections.includes("experience3") && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Reddit Partnership */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="border-l-2 border-[#d8ff00]/60 pl-4"
                    >
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">Community Partnership & Event Host</h3>
                          <p className="text-white/90 font-semibold">Reddit Collectible Avatars</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-[#d8ff00]/10">2022 – 2023</Badge>
                      </div>
                      <ul className="space-y-1.5 text-sm text-white/80 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>One of seven selected flagship artists for Reddit Collectable Avatars program</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Collaborated with Reddit's Collectible Avatar and Blockchain Teams to support integration and marketing strategy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Produced and hosted official Reddit X (Twitter) Spaces, managing live interviews and educational content</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Led community rollout and audience engagement for Reddit's NFT and blockchain initiatives</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Art showcased in Times Square, NYC, through Reddit's global Collectible Avatar campaign</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* First CMO Tenure */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="border-l-2 border-[#d8ff00]/60 pl-4"
                    >
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">Chief Marketing Officer</h3>
                          <p className="text-white/90 font-semibold">Olympus DAO (First Tenure)</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-[#d8ff00]/10">2021 – 2022</Badge>
                      </div>
                      <ul className="space-y-1.5 text-sm text-white/80 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Directed marketing and communications for a top-10 DeFi protocol</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Oversaw Olympus' rapid growth from $12M to $4.3B market cap in under three months</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Designed and executed brand-defining campaigns including Cooler Loans, Convertible Deposits, and The Monetary Computer</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Integrated automation infrastructure using Notion, n8n, Slack, and Discord to unify DAO-wide communication</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#d8ff00] mt-1 font-bold">▸</span>
                          <span>Regularly hosted Twitter Spaces, live AMAs, and protocol briefings, strengthening community engagement</span>
                        </li>
                      </ul>
                    </motion.div>
                  </motion.div>
                )}

                {/* Skills Section */}
                {visibleSections.includes("skills") && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h2 className="text-2xl font-black text-[#d8ff00] mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      <TypewriterText text="TECHNICAL SKILLS & EXPERTISE" sectionKey="skills-title" />
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { 
                          category: "AI & Automation Engineering", 
                          skills: ["LLM Orchestration (OpenAI, Claude, LLaMA)", "ChromaDB & Vector Databases", "Multi-Agent Systems", "n8n Workflow Automation", "BullMQ Task Queues", "TensorRT Optimization", "LM Studio", "Retrieval-Augmented Generation"] 
                        },
                        { 
                          category: "Audio Production & Sound Design", 
                          skills: ["Ableton Live", "Pro Tools", "FL Studio", "Sound Design & Foley", "Mixing & Mastering", "Film Scoring", "Brand Sonic Identity", "Adaptive Audio Systems"] 
                        },
                        { 
                          category: "Software Development & Infrastructure", 
                          skills: ["Node.js & Fastify", "React & Next.js", "PostgreSQL & Prisma", "Redis & Caching", "Docker Containerization", "AWS Cloud Services", "Express.js", "TypeScript"] 
                        },
                        { 
                          category: "Blockchain & DeFi", 
                          skills: ["Ethereum & EVM", "Solana Development", "Polygon & L2s", "Gnosis Safe", "DeFi Protocols", "Smart Contract Integration", "Protocol-Owned Liquidity", "Yield Strategies"] 
                        },
                        { 
                          category: "Marketing & Growth Strategy", 
                          skills: ["DAO Scaling & Governance", "GTM Architecture", "Community Building", "Institutional Messaging", "Analytics & Attribution", "Content Strategy", "Brand Positioning", "Crisis Communications"] 
                        },
                        { 
                          category: "Creative Software & Production", 
                          skills: ["Adobe Photoshop", "Illustrator", "After Effects", "Premiere Pro", "Fusion 360", "Cinema 4D", "VFX Compositing", "Motion Graphics"] 
                        },
                        { 
                          category: "Project Management & Collaboration", 
                          skills: ["Agile & Scrum", "Cross-Functional Leadership", "Notion Workspace Design", "Jira & Atlassian", "Slack Integration", "Discord Community Ops", "Telegram Bots", "Team Building"] 
                        },
                        { 
                          category: "Event Production & Media", 
                          skills: ["Twitter Spaces Hosting", "Live Panel Moderation", "Podcast Production", "Interview Direction", "Livestream Technical Direction", "Audience Engagement Analytics"] 
                        },
                      ].map((cat, index) => (
                        <motion.div
                          key={cat.category}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.15 }}
                          className="border-l-2 border-[#d8ff00]/30 pl-4"
                        >
                          <h3 className="text-base font-bold text-white mb-3">{cat.category}</h3>
                          <div className="flex flex-wrap gap-2">
                            {cat.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs bg-[#d8ff00]/5 border-[#d8ff00]/30">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Highlights Section */}
                {visibleSections.includes("highlights") && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h2 className="text-2xl font-black text-[#d8ff00] mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <TypewriterText text="KEY ACHIEVEMENTS & HIGHLIGHTS" sectionKey="achievements-title" />
                    </h2>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[
                        { value: "$4.3B", label: "Market Cap Scaled", sublabel: "From $12M in 3 months" },
                        { value: "$600K+", label: "NFT Sales", sublabel: "$100K single record sale" },
                        { value: "22M+", label: "Content Views", sublabel: "Viral multimedia campaigns" },
                        { value: "5+ Years", label: "Web3 Leadership", sublabel: "Top-tier protocols" },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-[#d8ff00]/30 p-4 text-center bg-[#d8ff00]/5"
                        >
                          <div className="text-3xl md:text-4xl font-black text-[#d8ff00] mb-1">{stat.value}</div>
                          <div className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1">{stat.label}</div>
                          <div className="text-[10px] text-white/50">{stat.sublabel}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Detailed Highlights */}
                    <div className="space-y-4">
                      {[
                        {
                          title: "Olympus DAO Leadership",
                          description: "Directed growth of one of DeFi's largest protocols, scaling from $12M → $4.3B market cap in 3 months. Spearheaded the 'Monetary Computer' narrative and institutional-grade brand strategy adopted across the ecosystem."
                        },
                        {
                          title: "Advanced AI Systems Expertise",
                          description: "Designed and deployed multi-agent LLM architectures with custom training pipelines and multimodal automation frameworks. Built inference environments using LM Studio, ChromaDB, and n8n for retrieval-augmented generation, contextual memory, and adaptive reasoning."
                        },
                        {
                          title: "Reddit Official Partnership",
                          description: "One of seven flagship artists selected for Reddit Collectible Avatars program. Collaborated directly with Reddit's blockchain team for NFT integration strategy. Art featured in Times Square as part of Reddit's global campaign."
                        },
                        {
                          title: "VibeCoders Consultancy",
                          description: "Built cross-disciplinary consultancy delivering AI development, automation design, marketing systems, and professional audio engineering to leading Web3 and Web2 organizations."
                        },
                        {
                          title: "NFT Pioneer & Digital Artist",
                          description: "Created the Apeliens series, pioneering the 1-of-1 auction mechanic and generating $600K+ in total sales. Recognized as internationally published artist influencing digital ownership culture."
                        },
                        {
                          title: "Community Event Leadership",
                          description: "Produced and hosted high-impact Twitter Spaces and live events for Olympus DAO, Railgun Protocol, and Reddit, drawing hundreds of real-time attendees and thousands of post-event viewers."
                        },
                        {
                          title: "Professional Audio Production",
                          description: "Specialized in brand sound design, immersive sonic identity, and adaptive AI-driven composition for multimedia campaigns. Delivered commercial music production for film, gaming, and protocol launches."
                        },
                        {
                          title: "Viral Content Creation",
                          description: "Concepted, produced, and distributed viral cross-platform content exceeding 22M+ views across Web3 and mainstream audiences through strategic storytelling and cutting-edge visual production."
                        },
                      ].map((highlight, index) => (
                        <motion.div
                          key={highlight.title}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-l-2 border-[#d8ff00]/40 pl-4 py-2"
                        >
                          <h3 className="text-base font-bold text-white mb-1">{highlight.title}</h3>
                          <p className="text-sm text-white/70 leading-relaxed">{highlight.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Completion Message */}
            {compilingPhase >= 7 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mt-8"
              >
                <p className="text-[#d8ff00] font-bold flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Resume compiled successfully
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

