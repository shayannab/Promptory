import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Logo/Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
            <span className="text-4xl">🧠</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-6 leading-tight">
            Promptory
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl">
            Your AI Prompt Lab, Streamlined.
          </p>

          {/* Description */}
          <p className="text-lg text-gray-400 mb-12 max-w-3xl">
            Create, store, edit, and organize powerful AI prompts effortlessly with intelligent assistance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/signup">
              <button className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Get Started
              </button>
            </Link>
            <Link to="/playground">
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                Try Playground
              </button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Prompt Storage</h3>
              <p className="text-gray-400 text-sm">Safely store all your favorite AI prompts with proper tags and timestamps.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Assistance</h3>
              <p className="text-gray-400 text-sm">Use AI to auto-generate descriptions and categorize your prompts intelligently.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Easy Management</h3>
              <p className="text-gray-400 text-sm">Quickly edit, copy, or delete prompts from a modern, minimal dashboard UI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
