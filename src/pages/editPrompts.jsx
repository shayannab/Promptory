import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { fetchDescriptionFromGroq } from '../utils/groqClient';
import { useUser } from '../utils/UserContext';

const TITLE_LIMIT = 120;
const DESCRIPTION_LIMIT = 1500;

function EditPrompt() {
  const { id } = useParams();
  const { user } = useUser();
  const [prompt, setPrompt] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [descriptionGenerated, setDescriptionGenerated] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();

  const titleOver = title.length > TITLE_LIMIT;
  const descOver = description.length > DESCRIPTION_LIMIT;
  const disableSubmit = titleOver || descOver;

  useEffect(() => {
    if (user) fetchPrompt();
  }, [id, user]);

  const fetchPrompt = async () => {
    const { data, error } = await supabase.from('prompts').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching prompt:', error.message);
      toast.error('Failed to load prompt');
    } else {
      if (data.user_id !== user.id) {
        setPrompt(null);
        setLoading(false);
        return;
      }
      setPrompt(data);
      setTitle(data.title);
      setDescription(data.description);
      setCategory(data.category);
      setIsPublic(!!data.is_public);
    }
    setLoading(false);
  };

  const handleGenerateDescription = async (mode = 'normal') => {
    if (!title.trim()) {
      toast.error('Please enter a title first.');
      return;
    }
    setIsGenerating(true);
    toast.loading('Generating description...');
    const generated = await fetchDescriptionFromGroq(title, mode, (mode === 'short' || mode === 'detailed') ? description : "");
    toast.dismiss();
    setIsGenerating(false);
    if (generated) {
      setDescription(generated);
      setDescriptionGenerated(true);
      toast.success('Description generated successfully!');
    } else {
      toast.error('Generation failed. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (title.length > TITLE_LIMIT || description.length > DESCRIPTION_LIMIT) {
      toast.error('Content too long. Keep it concise!');
      return;
    }
    const finalCategory = category === 'other' ? customCategory : category;

    const { error } = await supabase
      .from('prompts')
      .update({
        title,
        description,
        category: finalCategory,
      })
      .eq('id', id);

    if (error) {
      toast.error('Update failed.');
      console.error(error.message);
    } else {
      toast.success('Prompt updated successfully!');
      navigate('/dashboard');
    }
  };

  const confirmUpdate = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !(category || customCategory)) {
      toast.error('All fields are required.');
      return;
    }

    if (title.length > TITLE_LIMIT || description.length > DESCRIPTION_LIMIT) {
      toast.error('Content too long. Keep it concise!');
      return;
    }

    setShowConfirmModal(true);
  };

  const handlePublicToggle = async () => {
    const newStatus = !isPublic;
    const { error } = await supabase
      .from('prompts')
      .update({ is_public: newStatus })
      .eq('id', id);
    if (error) {
      toast.error('Failed to update public status.');
    } else {
      setIsPublic(newStatus);
      toast.success(newStatus ? 'Prompt is now public!' : 'Prompt is now private.');
    }
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/public/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('🔗 Link copied!');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Please log in to edit prompts.</h2>
          <a href="/login" className="text-blue-400 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  if (!prompt && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">You do not have permission to edit this prompt.</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <Toaster position="top-center" />
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✏️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2">
            {isPublic ? <span title="Public"><span role="img" aria-label="public">🌍</span></span> : <span title="Private"><span role="img" aria-label="private">🔒</span></span>}
            Edit Prompt
            {isPublic && (
              <button
                className="ml-2 px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs flex items-center gap-1 transition-all"
                onClick={handleCopyShareLink}
                title="Copy public share link. Anyone with this link can view this prompt."
              >
                <span role="img" aria-label="share">🔗</span> Share
              </button>
            )}
          </h1>
          <p className="text-gray-400 text-lg">Update your AI prompt with enhanced features</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <form onSubmit={confirmUpdate} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-white font-semibold mb-3">Prompt Title</label>
              <input
                className={`w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${titleOver ? 'border-red-500' : ''}`}
                placeholder="Enter your prompt title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={TITLE_LIMIT + 100}
              />
              <div className={`text-right text-xs mt-1 ${titleOver ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                {title.length} / {TITLE_LIMIT} characters
                {titleOver && <span className="ml-2">Limit exceeded!</span>}
              </div>
            </div>

            {/* Description Input + AI Buttons */}
            <div>
              <label className="block text-white font-semibold mb-3">Description</label>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleGenerateDescription('normal')}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Re-generate'}
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateDescription('short')}
                  disabled={isGenerating}
                  className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Shorten
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateDescription('detailed')}
                  disabled={isGenerating}
                  className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Detailed
                </button>
              </div>
              <textarea
                className={`w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none ${descOver ? 'border-red-500' : ''}`}
                placeholder="Enter your prompt description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                maxLength={DESCRIPTION_LIMIT + 500}
              />
              <div className={`text-right text-xs mt-1 ${descOver ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                {description.length} / {DESCRIPTION_LIMIT} characters
                {descOver && <span className="ml-2">Limit exceeded!</span>}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-white font-semibold mb-3">Category</label>
              <select
                className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="writing">Writing</option>
                <option value="marketing">Marketing</option>
                <option value="coding">Coding</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>

              {category === 'other' && (
                <input
                  className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors mt-3"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Public toggle */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="public-toggle"
                checked={isPublic}
                onChange={handlePublicToggle}
                className="form-checkbox h-4 w-4 text-blue-600 transition-all"
              />
              <label htmlFor="public-toggle" className="text-sm text-gray-300 cursor-pointer select-none" title="Anyone with the link can view this prompt">
                Make Public
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className={`flex-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg ${disableSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disableSubmit}
              >
                Update Prompt
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Update Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Update?</h3>
            <p className="text-gray-400 mb-8">This will overwrite the current prompt data. Are you sure you want to proceed?</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  handleUpdate();
                  setShowConfirmModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors"
              >
                Yes, Update
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
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

export default EditPrompt;
