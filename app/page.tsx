"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import PlayCanvasHero from "./components/PlayCanvasHero";
import Services from "./components/Services";
import ContactForm from "./components/ContactForm";
import Header from "./components/Header";

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
  useEffect(() => {
    // Suppress known PlayCanvas warnings
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('OrbitCameraInputMouse') ||
        message.includes('scriptName') ||
        message.includes('forward-logs-shared') ||
        message.includes('intercept-console-error')
      ) {
        return;
      }
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('OrbitCameraInputMouse') ||
        message.includes('initialize')
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return (
    <>
      <Header />
      <PlayCanvasHero />
      <ScrollSection id="services">
        <Services />
      </ScrollSection>
      <ContactForm />
    </>
  );
}
