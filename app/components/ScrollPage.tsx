'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Zap, Target, Code, Rocket, MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';

const RobotHead = dynamic(() => import('./RobotHead'), { ssr: false });
const AIOrb = dynamic(() => import('./AIOrb'), { ssr: false });
const NeuralNetworkViz = dynamic(() => import('./NeuralNetworkViz'), { ssr: false });

function ScrollSection({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function ScrollPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section with Robot Head */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 animate-gradient" />
        
        {/* 3D Robot Head */}
        <motion.div 
          className="absolute inset-0 opacity-50"
          style={{ opacity }}
        >
          <RobotHead />
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full mb-8 border border-white/20"
            >
              <Sparkles size={20} className="animate-pulse" />
              <span className="text-sm font-medium">AI-Powered Solutions</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-6xl md:text-8xl font-bold mb-8 text-white drop-shadow-2xl"
            >
              Transform Your Business with{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-lg"
            >
              Cutting-edge AI solutions tailored to your needs. Let's build something extraordinary together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#contact"
                className="group bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-10 py-5 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Get Free Consultation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full text-lg font-semibold border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                Explore Solutions
              </a>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-20"
            >
              <div className="animate-bounce text-white/60 text-sm">Scroll to explore</div>
              <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent mx-auto mt-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section with AI Orb */}
      <ScrollSection id="services">
        <section className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden py-20">
          {/* AI Orb Background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-96 opacity-30 pointer-events-none hidden lg:block">
            <AIOrb />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                What We Offer
              </h2>
              <p className="text-xl text-gray-600 mb-16 max-w-2xl">
                Comprehensive AI solutions designed to drive innovation and growth
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: Brain, title: 'AI Strategy & Consulting', desc: 'Strategic guidance to integrate AI into your business operations.' },
                  { icon: Code, title: 'Custom AI Development', desc: 'Tailored AI solutions built from scratch for your needs.' },
                  { icon: Zap, title: 'Machine Learning Models', desc: 'Advanced ML models that learn and improve over time.' },
                  { icon: Target, title: 'Automation Solutions', desc: 'Streamline workflows and boost productivity.' },
                  { icon: Sparkles, title: 'Natural Language Processing', desc: 'Build conversational AI and chatbots.' },
                  { icon: Rocket, title: 'AI Integration', desc: 'Seamlessly integrate AI into your infrastructure.' },
                ].map((service, i) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border border-purple-100"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <service.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* Process Section with Neural Network */}
      <ScrollSection>
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 relative overflow-hidden py-20">
          {/* Neural Network Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <NeuralNetworkViz />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-12 text-white">
                Our Process
              </h2>

              <div className="space-y-12">
                {[
                  { step: '01', title: 'Discovery', desc: 'We analyze your business needs and identify AI opportunities' },
                  { step: '02', title: 'Strategy', desc: 'Custom AI roadmap tailored to your goals and infrastructure' },
                  { step: '03', title: 'Development', desc: 'Build and train cutting-edge AI models with your data' },
                  { step: '04', title: 'Integration', desc: 'Seamlessly deploy AI solutions into your workflow' },
                  { step: '05', title: 'Optimization', desc: 'Continuous improvement and performance monitoring' },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-8 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
                  >
                    <div className="text-6xl font-bold text-cyan-400">{item.step}</div>
                    <div className="text-left flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/80">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* Stats Section */}
      <ScrollSection>
        <section className="min-h-screen flex items-center justify-center bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { value: '100%', label: 'AI Innovation', desc: 'Cutting-edge technology' },
                  { value: '95+%', label: 'Client Satisfaction', desc: 'Happy customers worldwide' },
                  { value: '50+', label: 'Projects Delivered', desc: 'Successful implementations' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    className="text-center"
                  >
                    <div className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                      {stat.value}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stat.label}</div>
                    <div className="text-gray-600">{stat.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>
    </div>
  );
}
