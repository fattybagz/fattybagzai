"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform scroll position to opacity values
  // At scroll 0-100px: opacity stays at 0.95
  // At scroll 100-300px: fades from 0.95 to 0
  const bgOpacity = useTransform(scrollY, [100, 300], [0.95, 0]);
  const borderOpacity = useTransform(scrollY, [100, 300], [0.1, 0]);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        backgroundColor: useTransform(bgOpacity, (o) => `rgba(0, 0, 0, ${o})`),
        borderBottomColor: useTransform(borderOpacity, (o) => `rgba(255, 255, 255, ${o})`),
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
      }}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-black tracking-tighter text-white"
            >
              Atlas<span className="text-[#d8ff00]">Ward</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#experience"
              className="text-sm font-bold text-white/70 hover:text-[#d8ff00] transition-colors"
            >
              Experience
            </Link>
            <Link
              href="#skills"
              className="text-sm font-bold text-white/70 hover:text-[#d8ff00] transition-colors"
            >
              Skills
            </Link>
            <Link
              href="#contact"
              className="bg-[#d8ff00] text-black px-6 py-2.5 text-sm font-black hover:bg-[#d8ff00]/90 transition-all shadow-lg shadow-[#d8ff00]/20 rounded-[5px]"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-[#d8ff00] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pt-4 pb-2 flex flex-col gap-4 border-t border-white/10 mt-4"
          >
            <Link
              href="#experience"
              className="text-sm font-medium text-white/70 hover:text-[#d8ff00] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Experience
            </Link>
            <Link
              href="#skills"
              className="text-sm font-medium text-white/70 hover:text-[#d8ff00] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Skills
            </Link>
            <Link
              href="#contact"
              className="bg-[#d8ff00] text-black px-6 py-2.5 text-sm font-semibold text-center hover:bg-[#d8ff00]/90 transition-all shadow-lg shadow-[#d8ff00]/20 rounded-[5px]"
              onClick={() => setIsMenuOpen(false)}
            >
              Get in Touch
            </Link>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
