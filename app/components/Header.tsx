"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              fattybagz.ai
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="#contact"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-shadow"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
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
            className="md:hidden pt-4 pb-2 flex flex-col gap-4"
          >
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="#contact"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-center"
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
