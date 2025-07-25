import { Link } from 'react-router-dom';
import { BookText, Sparkles, Settings2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] dark:bg-[#0E0E10] text-black dark:text-white flex flex-col justify-center items-center">
      <main className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-8 gap-12 py-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center w-full gap-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Promptory</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Your AI Prompt Lab, Streamlined.
          </p>
          <div className="flex flex-row gap-4 mt-4">
            <Link to="/signup">
              <button className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-base bg-transparent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Get Started
              </button>
            </Link>
            <Link to="/playground">
              <button className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-base bg-transparent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Try Playground
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BookText strokeWidth={1.5} className="w-8 h-8 mx-auto mb-3" />}
            title="Prompt Storage"
            description="Safely store all your favorite AI prompts with tags and timestamps."
          />
          <FeatureCard
            icon={<Sparkles strokeWidth={1.5} className="w-8 h-8 mx-auto mb-3" />}
            title="AI Assistance"
            description="Use AI to auto-generate descriptions and categorize your prompts."
          />
          <FeatureCard
            icon={<Settings2 strokeWidth={1.5} className="w-8 h-8 mx-auto mb-3" />}
            title="Easy Management"
            description="Quickly edit, copy, or delete prompts from a modern dashboard."
          />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181B] shadow-sm hover:shadow-lg transition-all duration-200">
      {icon}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-base">{description}</p>
    </div>
  );
}
