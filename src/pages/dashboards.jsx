import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '../utils/UserContext';

function Dashboard() {
  const { user, displayName } = useUser();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      setPrompts(data);
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
    toast.success('🔗 Link copied!');
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Please log in to view your dashboard.</h2>
          <a href="/login" className="text-blue-400 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Toaster position="top-center" reverseOrder={false} />
        {/* Personal Greeting */}
        <div className="mb-6 text-2xl font-bold text-white">
          {user ? (displayName ? `Hey, ${displayName} 👋` : `Hey, ${user.email}`) : 'Hey, you!'}
        </div>
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4">
                Dashboard
              </h1>
              <p className="text-xl text-gray-400">Manage your AI prompts with ease</p>
            </div>
            <Link
              to="/add"
              className="mt-6 lg:mt-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              + Add New Prompt
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Prompts</p>
                  <p className="text-3xl font-bold text-white">{totalPrompts}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Categories</p>
                  <p className="text-3xl font-bold text-white">{totalCategories}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏷️</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">AI Enhanced</p>
                  <p className="text-3xl font-bold text-white">100%</p>
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
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
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
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No prompts found</h3>
            <p className="text-gray-400 mb-6">Create your first prompt to get started!</p>
            <Link
              to="/add"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
            >
              Create First Prompt
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <div key={prompt.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                      {prompt.is_public ? <span title="Public"><span role="img" aria-label="public">🌍</span></span> : <span title="Private"><span role="img" aria-label="private">🔒</span></span>}
                      {prompt.title}
                    </h3>
                    {/* Share icon with tooltip */}
                    {prompt.is_public && (
                      <button
                        className="ml-1 px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs flex items-center gap-1 transition-all"
                        onClick={() => handleCopyShareLink(prompt.id)}
                        title="Copy public share link. Anyone with this link can view this prompt."
                      >
                        <span role="img" aria-label="share">🔗</span> Share
                      </button>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full">
                    {getCategoryLabel(prompt.category)}
                  </span>
                </div>
                <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                  {prompt.description}
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  Created: {new Date(prompt.created_at).toLocaleDateString()}
                </div>
                {/* Public toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id={`public-toggle-${prompt.id}`}
                    checked={!!prompt.is_public}
                    onChange={() => handlePublicToggle(prompt)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition-all"
                  />
                  <label htmlFor={`public-toggle-${prompt.id}`} className="text-sm text-gray-300 cursor-pointer select-none" title="Anyone with the link can view this prompt">
                    Make Public
                  </label>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/edit/${prompt.id}`}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setPromptToDelete(prompt.id)}
                    className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-all duration-300 border border-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {promptToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">Delete Prompt?</h3>
            <p className="text-gray-400 mb-8">This action cannot be undone. Are you sure you want to delete this prompt?</p>
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
    </div>
  );
}

export default Dashboard;
