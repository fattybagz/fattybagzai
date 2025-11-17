"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import PlayCanvasHero from "./components/PlayCanvasHero";
import Services from "./components/Services";
import Skills from "./components/Skills";
import ContactForm from "./components/ContactForm";
import Header from "./components/Header";
import { CompiledResume } from "./components/CompiledResume";

function ScrollSection({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <>
      <Header />
      <CompiledResume isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      
      <motion.div
        animate={{
          opacity: isResumeOpen ? 0 : 1,
          y: isResumeOpen ? 20 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <PlayCanvasHero />
        <ScrollSection id="experience">
          <Services onCompileResume={() => setIsResumeOpen(true)} />
        </ScrollSection>
        <ScrollSection id="skills">
          <Skills />
        </ScrollSection>
        <ScrollSection id="contact">
          <ContactForm />
        </ScrollSection>
      </motion.div>
    </>
  );
}
