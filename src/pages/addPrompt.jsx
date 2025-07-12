import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { fetchDescriptionFromGroq, categorizePromptWithGroq } from '../utils/groqClient.js';
import { useUser } from '../utils/UserContext';

const TITLE_LIMIT = 120;
const DESCRIPTION_LIMIT = 1500;

function AddPrompt() {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [descriptionGenerated, setDescriptionGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const titleOver = title.length > TITLE_LIMIT;
  const descOver = description.length > DESCRIPTION_LIMIT;
  const disableSubmit = titleOver || descOver;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !(category || customCategory)) {
      toast.error('All fields are required!');
      return;
    }

    if (title.length > TITLE_LIMIT || description.length > DESCRIPTION_LIMIT) {
      toast.error('Content too long. Keep it concise!');
      return;
    }

    let finalCategory = category;

    if (category === 'auto') {
      toast.loading('Auto-categorizing...');
      const autoCat = await categorizePromptWithGroq(title, description);
      toast.dismiss();

      if (autoCat) {
        finalCategory = autoCat;
        toast.success(`Auto-categorized as "${autoCat}"`);
      } else {
        toast.error('Failed to auto-categorize. Please choose manually.');
        return;
      }
    } else if (category === 'custom') {
      finalCategory = customCategory;
    }

    const { error } = await supabase.from('prompts').insert([
      { title, description, category: finalCategory, user_id: user.id }
    ]);

    if (error) {
      toast.error(`Failed to add prompt: ${error.message}`);
      console.error(error);
    } else {
      toast.success('Prompt added successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4">
            Add New Prompt
          </h1>
          <p className="text-gray-400 text-lg">Create and enhance your AI prompts with intelligent assistance</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-white font-semibold mb-3">Prompt Title</label>
              <input
                className={`w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${titleOver ? 'border-red-500' : ''}`}
                placeholder="Enter your prompt title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={TITLE_LIMIT + 100} // allow typing over limit for warning
              />
              <div className={`text-right text-xs mt-1 ${titleOver ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                {title.length} / {TITLE_LIMIT} characters
                {titleOver && <span className="ml-2">Limit exceeded!</span>}
              </div>
            </div>

            {/* Description Generation */}
            <div>
              <label className="block text-white font-semibold mb-3">Description</label>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleGenerateDescription()}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate Description'}
                </button>
                
                {descriptionGenerated && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGenerateDescription('short')} 
                      type="button" 
                      className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
                    >
                      Shorten
                    </button>
                    <button 
                      onClick={() => handleGenerateDescription('detailed')} 
                      type="button" 
                      className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
                    >
                      Detailed
                    </button>
                    <button 
                      onClick={() => handleGenerateDescription('normal')} 
                      type="button" 
                      className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
                    >
                      Re-generate
                    </button>
                  </div>
                )}
              </div>
              
              <textarea
                className={`w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none ${descOver ? 'border-red-500' : ''}`}
                placeholder="Enter or generate a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                maxLength={DESCRIPTION_LIMIT + 500} // allow typing over limit for warning
              />
              <div className={`text-right text-xs mt-1 ${descOver ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                {description.length} / {DESCRIPTION_LIMIT} characters
                {descOver && <span className="ml-2">Limit exceeded!</span>}
              </div>
              
              {descriptionGenerated && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(description);
                    toast.success('Description copied to clipboard!');
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300 mt-2 transition-colors"
                >
                  📋 Copy to clipboard
                </button>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-white font-semibold mb-3">Category</label>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className={`px-4 py-3 rounded-xl font-semibold border transition-colors focus:outline-none ${category === 'auto' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/10 text-white border-white/20 hover:bg-blue-900/20'}`}
                  onClick={() => { setCategory('auto'); setCustomCategory(''); }}
                >
                  Auto-categorize with AI
                </button>
                <button
                  type="button"
                  className={`px-4 py-3 rounded-xl font-semibold border transition-colors focus:outline-none ${category === 'custom' ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white/10 text-white border-white/20 hover:bg-cyan-900/20'}`}
                  onClick={() => setCategory('custom')}
                >
                  Customize manually
                </button>
                {category === 'custom' && (
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 text-white border border-cyan-600 focus:outline-none focus:border-blue-500"
                    placeholder="Enter custom category..."
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg ${disableSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disableSubmit}
            >
              Create Prompt
            </button>
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
    </div>
  );
}

export default AddPrompt;
