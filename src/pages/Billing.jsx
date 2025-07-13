import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Basic prompt management',
      'Limited prompts',
      'Community sharing',
      'Basic AI feedback',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12/mo',
    features: [
      'Unlimited prompts',
      'Advanced AI feedback',
      'Analytics dashboard',
      'Priority support',
      'Future: Stripe billing',
    ],
    highlight: true,
  },
];

export default function Billing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">💳 Billing & Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border border-white/10 p-8 shadow-xl bg-white/10 dark:bg-black/40 backdrop-blur-md flex flex-col items-center transition-all duration-300 ${plan.highlight ? 'ring-2 ring-blue-500 scale-105' : ''}`}
          >
            <div className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
              {plan.name} {plan.highlight && <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">Pro</span>}
            </div>
            <div className="text-4xl font-extrabold text-blue-400 mb-4">{plan.price}</div>
            <ul className="mb-6 space-y-2 text-gray-200 text-left w-full max-w-xs mx-auto">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-400">✔</span> {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${plan.highlight ? '' : 'opacity-70'}`}
              disabled={!plan.highlight}
            >
              {plan.highlight ? 'Upgrade (Coming Soon)' : 'Current Plan'}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-10 text-gray-400 text-sm text-center">
        Stripe integration coming soon. For now, all features are available for free during beta.
      </div>
      <div className="mt-8">
        <Link to="/dashboard" className="text-blue-400 hover:underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
} 