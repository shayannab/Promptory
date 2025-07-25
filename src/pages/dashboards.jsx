import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../utils/UserContext';
import { getPromptFeedbackFromGroq } from '../utils/groqClient';
import QuickActionsMenu from '../components/sections/QuickActionsMenu';
import { motion } from 'framer-motion';
import { ClipboardIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import confetti from 'canvas-confetti';

function FeedbackModal({ show, onClose, feedback, loading }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-200/50 dark:border-white/10">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Prompt Feedback</h3>
        {loading ? (
          <div className="text-gray-700 dark:text-white text-center">Getting feedback...</div>
        ) : feedback ? (
          <div className="space-y-3">
            <div><span className="font-semibold text-blue-600 dark:text-blue-300">Rating:</span> <span className="text-gray-900 dark:text-white">{feedback.rating} / 5</span></div>
            <div><span className="font-semibold text-blue-600 dark:text-blue-300">Tone:</span> <span className="text-gray-900 dark:text-white">{feedback.tone}</span></div>
            <div><span className="font-semibold text-blue-600 dark:text-blue-300">Clarity:</span> <span className="text-gray-900 dark:text-white">{feedback.clarity}</span></div>
            <div><span className="font-semibold text-blue-600 dark:text-blue-300">Improvement:</span> <span className="text-gray-900 dark:text-white">{feedback.improvement}</span></div>
          </div>
        ) : (
          <div className="text-red-600 dark:text-red-400">Failed to get feedback. Try again later.</div>
        )}
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Close</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user, displayName } = useUser();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [feedbackModal, setFeedbackModal] = useState({ show: false, loading: false, feedback: null });
  const [selectPromptModal, setSelectPromptModal] = useState(false);
  // Add for copy tooltip animation
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [lastPromptCount, setLastPromptCount] = useState(0);

  useEffect(() => {
    if (user) fetchPrompts();
  }, [user]);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prompts:', error.message);
      toast.error('Failed to load prompts');
    } else {
      // Confetti if prompt was just added
      if (lastPromptCount && data.length > lastPromptCount) {
        confetti({
          particleCount: 48,
          spread: 70,
          origin: { y: 0.7 },
          startVelocity: 22,
          scalar: 0.8,
          ticks: 90,
          colors: ['#60A5FA', '#A78BFA', '#34D399', '#FDE68A', '#818CF8'],
        });
      }
      setPrompts(data);
      setLastPromptCount(data.length);
    }
    setLoading(false);
  };

  // Defensive: fallback to 'Uncategorized' if category is null/undefined/empty
  const getCategoryLabel = (cat) => {
    if (!cat) return 'Uncategorized';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Handle public toggle
  const handlePublicToggle = async (prompt) => {
    const newStatus = !prompt.is_public;
    const { error } = await supabase
      .from('prompts')
      .update({ is_public: newStatus })
      .eq('id', prompt.id);
    if (error) {
      toast.error('Failed to update public status.');
    } else {
      setPrompts((prev) => prev.map((p) => p.id === prompt.id ? { ...p, is_public: newStatus } : p));
      toast.success(newStatus ? 'Prompt is now public!' : 'Prompt is now private.');
    }
  };

  // Handle copy share link
  const handleCopyShareLink = (promptId) => {
    const url = `${window.location.origin}/public/${promptId}`;
    navigator.clipboard.writeText(url);
    setCopiedPromptId(promptId);
    toast.success('🔗 Link copied!');
    setTimeout(() => setCopiedPromptId(null), 1200);
  };

  const handleGetFeedback = async (prompt) => {
    setFeedbackModal({ show: true, loading: true, feedback: null });
    const feedback = await getPromptFeedbackFromGroq(prompt.title, prompt.description);
    setFeedbackModal({ show: true, loading: false, feedback });
  };

  // For QuickActionsMenu: open prompt selector for feedback
  const handleQuickFeedback = () => setSelectPromptModal(true);

  // Filter prompts based on search and category
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const promptCategory = prompt.category || 'Uncategorized';
    const matchesCategory = selectedCategory === 'all' || promptCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter, fallback to 'Uncategorized' if missing
  const categories = ['all', ...Array.from(new Set(prompts.map(p => p.category || 'Uncategorized')))]
    .filter((v, i, arr) => arr.indexOf(v) === i);

  // Get stats
  const totalPrompts = prompts.length;
  const totalCategories = new Set(prompts.map(p => p.category || 'Uncategorized')).size;

  // Redirect to login if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="bg-white/80 dark:bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md text-center backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Please log in to view your dashboard.</h2>
          <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 py-6 sm:py-8 pb-20 mt-8 mb-8">
        <Toaster position="top-center" reverseOrder={false} />
        {/* Personal Greeting */}
        <div className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {user ? (displayName ? `Hey, ${displayName} 👋` : `Hey, ${user.email}`) : 'Hey, you!'}
        </div>
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-cyan-600 dark:from-white dark:via-blue-100 dark:to-cyan-100 bg-clip-text text-transparent mb-4">
                Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">Manage your AI prompts with ease</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              className="mt-6 lg:mt-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => window.location.href = '/add'}
              type="button"
            >
              + Add New Prompt
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Prompts</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPrompts}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Categories</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCategories}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏷️</span>
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">AI Enhanced</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">100%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category === 'all'
                    ? 'All Categories'
                    : getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-28 h-28 mb-6 flex items-center justify-center">
              {/* Cute empty state illustration (speech bubble + spark) */}
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="45" cy="45" rx="40" ry="32" fill="url(#bubble)" fillOpacity="0.18" />
                <ellipse cx="45" cy="45" rx="36" ry="28" fill="url(#bubble2)" fillOpacity="0.12" />
                <path d="M45 20 L48 32 L60 36 L48 40 L45 52 L42 40 L30 36 L42 32 Z" fill="url(#spark)" stroke="url(#sparkStroke)" strokeWidth="1.5" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="bubble" x1="5" y1="13" x2="85" y2="77" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60A5FA" />
                    <stop offset="1" stopColor="#A78BFA" />
                  </linearGradient>
                  <linearGradient id="bubble2" x1="9" y1="17" x2="81" y2="73" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34D399" />
                    <stop offset="1" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient id="spark" x1="30" y1="20" x2="60" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDE68A" />
                    <stop offset="1" stopColor="#818CF8" />
                  </linearGradient>
                  <linearGradient id="sparkStroke" x1="30" y1="20" x2="60" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDE68A" />
                    <stop offset="1" stopColor="#818CF8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">No prompts? That’s kinda empty energy 💭</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first prompt and let the magic begin!</p>
            <Link
              to="/add"
              className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-[0_0_20px_#10B98155] hover:scale-105 transition-all duration-300"
            >
              Add Prompt
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                className="group bg-white/10 dark:bg-black/30 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 flex flex-col min-h-[260px]"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
                whileTap={{ scale: 0.98 }}
                tabIndex={0}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-heading font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                      {prompt.title}
                    </h3>
                    {/* Copy icon with tooltip/animation */}
                    <button
                      className="ml-1 p-1 rounded-full bg-white/10 hover:bg-emerald-400/20 transition-colors relative"
                      onClick={() => handleCopyShareLink(prompt.id)}
                      title="Copy prompt text"
                    >
                      <span className="relative inline-block">
                        <ClipboardIcon className="w-5 h-5 text-emerald-300" />
                        {copiedPromptId === prompt.id && (
                          <>
                            {/* Sparkle animation */}
                            <motion.svg
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                              className="absolute -top-2 -right-2 w-5 h-5 pointer-events-none"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g filter="url(#sparkle-glow)">
                                <path d="M10 2 L11 7 L16 8 L11 9 L10 14 L9 9 L4 8 L9 7 Z" fill="#FDE68A" fillOpacity="0.7" />
                              </g>
                              <defs>
                                <filter id="sparkle-glow" x="0" y="0" width="20" height="20" filterUnits="userSpaceOnUse">
                                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                                  <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                  </feMerge>
                                </filter>
                              </defs>
                            </motion.svg>
                          </>
                        )}
                      </span>
                      {copiedPromptId === prompt.id && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-emerald-500 text-white shadow font-semibold animate-fadeIn z-10">Copied!</span>
                      )}
                    </button>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-gradient-to-r ${prompt.category === 'Inspiration' ? 'from-pink-400 to-yellow-300 text-white' : prompt.category === 'Code' ? 'from-blue-500 to-cyan-400 text-white' : 'from-emerald-400 to-blue-400 text-white'}`}>
                    {getCategoryLabel(prompt.category)}
                  </span>
                </div>
                <p className="text-white/90 mb-4 line-clamp-3 leading-relaxed text-base font-body">
                  {prompt.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-white/60 mb-4">
                  <span>Created: {new Date(prompt.created_at).toLocaleString()}</span>
                  {prompt.updated_at && (
                    <span>Last Edited: {new Date(prompt.updated_at).toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id={`public-toggle-${prompt.id}`}
                    checked={!!prompt.is_public}
                    onChange={() => handlePublicToggle(prompt)}
                    className="form-checkbox h-4 w-4 text-emerald-400 transition-all"
                  />
                  <label htmlFor={`public-toggle-${prompt.id}`} className="text-sm text-white/80 cursor-pointer select-none" title="Anyone with the link can view this prompt">
                    Make Public
                  </label>
                </div>
                <div className="flex gap-3 mt-auto">
                  {user && (
                    <>
                      <Link
                        to={`/edit/${prompt.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-center shadow"
                      >
                        <PencilSquareIcon className="w-4 h-4 inline-block mr-1 align-text-bottom" /> Edit
                      </Link>
                      <button
                        onClick={() => setPromptToDelete(prompt.id)}
                        className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-all duration-300 border border-red-500/30 shadow"
                      >
                        <TrashIcon className="w-4 h-4 inline-block mr-1 align-text-bottom" /> Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {promptToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-200/50 dark:border-white/10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Delete Prompt?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">This action cannot be undone. Are you sure you want to delete this prompt?</p>
            <div className="flex gap-4">
              <button
                onClick={async () => {
                  const { error } = await supabase
                    .from('prompts')
                    .delete()
                    .eq('id', promptToDelete);

                  if (error) {
                    toast.error('Failed to delete prompt.');
                  } else {
                    toast.success('Prompt deleted successfully!');
                    setPrompts((prev) => prev.filter((p) => p.id !== promptToDelete));
                  }
                  setPromptToDelete(null);
                }}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setPromptToDelete(null)}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <FeedbackModal
        show={feedbackModal.show}
        loading={feedbackModal.loading}
        feedback={feedbackModal.feedback}
        onClose={() => setFeedbackModal({ show: false, loading: false, feedback: null })}
      />
      <QuickActionsMenu onFeedback={handleQuickFeedback} />
      {/* Prompt Selector Modal for Quick Feedback */}
      {selectPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-gray-200/50 dark:border-white/10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Select a Prompt for Feedback</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={async () => {
                    setSelectPromptModal(false);
                    await handleGetFeedback(prompt);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-100/80 dark:bg-white/10 hover:bg-blue-600 hover:text-white text-gray-900 dark:text-white font-semibold transition-all"
                >
                  <div className="font-bold">{prompt.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">{prompt.description}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setSelectPromptModal(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
