import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20"></div>
      
      {/* Animated floating blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Logo and Brand */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl mb-6 shadow-2xl">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent leading-none">
            Promptory
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
          Your AI Prompt Lab, <span className="text-blue-400 font-semibold">Streamlined</span>
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-4xl leading-relaxed">
          Not just a prompt library. Your own AI-powered prompt lab where creativity meets intelligence. 
          Store, organize, and enhance your prompts with cutting-edge AI assistance.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-20">
          <Link to="/dashboard">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25">
              <span className="relative z-10">Start for Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
          <Link to="/add">
            <button className="px-10 py-5 bg-white/5 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border-2 border-white/20 hover:bg-white/10 hover:border-white/30 transform hover:scale-105 transition-all duration-300">
              🚀 Launch Playground
            </button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full mb-20">
          <FeatureCard
            title="Prompt Storage"
            description="Safely store all your favorite AI prompts with proper tags and timestamps."
            icon="💾"
            gradient="from-blue-500 to-blue-600"
          />
          <FeatureCard
            title="AI Assistance"
            description="Use AI to auto-generate descriptions and categorize your prompts intelligently."
            icon="🤖"
            gradient="from-cyan-500 to-cyan-600"
          />
          <FeatureCard
            title="Easy Management"
            description="Quickly edit, copy, or delete prompts from a modern, minimal dashboard UI."
            icon="⚡"
            gradient="from-indigo-500 to-indigo-600"
          />
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-12 text-gray-400">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">1000+</div>
            <div className="text-sm uppercase tracking-wider">Prompts Stored</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">50+</div>
            <div className="text-sm uppercase tracking-wider">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm uppercase tracking-wider">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, description, icon, gradient }) {
  return (
    <div className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-white/20">
      {/* Icon */}
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
        {icon}
      </div>
      
      {/* Content */}
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-lg">{description}</p>
      
      {/* Hover glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
    </div>
  );
}
