// Hero.jsx
import React from "react";

const Hero = () => {
  return (
    <section className="w-full h-screen bg-gradient-to-br from-[#0f051d] via-[#1f123a] to-[#140b33] flex items-center justify-center text-white px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Unlock the Power of AI Prompts
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Discover, save, and run optimized prompts with ease — Promptory makes prompt engineering seamless.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
            Get Started
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">
            Explore Prompts
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
