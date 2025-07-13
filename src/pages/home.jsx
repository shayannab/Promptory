import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto w-full">
          {/* Logo/Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-lg">
            <span className="text-3xl sm:text-4xl">🧠</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-cyan-600 dark:from-white dark:via-blue-100 dark:to-cyan-100 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            Promptory
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 max-w-2xl">
            Your AI Prompt Lab, Streamlined.
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-3xl">
            Create, store, edit, and organize powerful AI prompts effortlessly with intelligent assistance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16">
            <Link to="/signup">
              <button className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Get Started
              </button>
            </Link>
            <Link to="/playground">
              <button className="bg-white/80 dark:bg-white/10 backdrop-blur-sm text-gray-900 dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold border border-gray-200/50 dark:border-white/20 hover:bg-white dark:hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                Try Playground
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center">Prompt Storage</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base text-center leading-relaxed">Safely store all your favorite AI prompts with proper tags and timestamps.</p>
            </div>

            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center">AI Assistance</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base text-center leading-relaxed">Use AI to auto-generate descriptions and categorize your prompts intelligently.</p>
            </div>

            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center">Easy Management</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base text-center leading-relaxed">Quickly edit, copy, or delete prompts from a modern, minimal dashboard UI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
