import React from "react";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RocketIcon } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-zinc-950 dark:to-black overflow-hidden flex flex-col items-center justify-center text-center px-6">
      
      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
      >
        Promptory
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-4 max-w-xl text-lg md:text-xl text-gray-600 dark:text-gray-300"
      >
        Your AI prompt vault. Organize, optimize & create like a boss.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-8"
      >
        <Link to="/dashboard">
          <Button
            size="lg"
            className="gap-2 text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-xl shadow-xl transition-all duration-300"
          >
            <RocketIcon className="w-4 h-4" />
            Launch Promptory
          </Button>
        </Link>
      </motion.div>

      {/* Optional: floating sparkles or backdrop blobs */}
      {/* You can add visuals here if needed */}
    </section>
  );
}
