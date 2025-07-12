import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function PublicPrompt() {
  const { id } = useParams();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = prompt && prompt.is_public
      ? `${prompt.title} | Public Prompt | Promptory`
      : 'Public Prompt | Promptory';
    if (prompt && prompt.is_public && prompt.description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', prompt.description);
      else {
        const m = document.createElement('meta');
        m.name = 'description';
        m.content = prompt.description;
        document.head.appendChild(m);
      }
    }
  }, [prompt]);

  useEffect(() => {
    const fetchPrompt = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('prompts')
        .select('id, title, description, prompt_text, is_public, created_at')
        .eq('id', id)
        .single();
      if (error || !data) {
        setError('🔒 This prompt is private or doesn\'t exist.');
        setPrompt(null);
      } else if (!data.is_public) {
        setError('🔒 This prompt is private or doesn\'t exist.');
        setPrompt(null);
      } else {
        setPrompt(data);
      }
      setLoading(false);
    };
    fetchPrompt();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
        <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md mx-auto text-center">
          <div className="text-4xl mb-4">🔒</div>
          <div className="text-red-400 text-lg font-semibold mb-4">{error}</div>
          <Link to="/" className="text-blue-400 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-green-700 text-white rounded-full text-xs font-semibold">🌍 Public Prompt</span>
          <span className="text-xs text-gray-400">Anyone with this link can view this prompt.</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">{prompt.title}</h1>
        <div className="mb-4 text-gray-300">{prompt.description}</div>
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1 font-semibold">Prompt Text</label>
          <div className="bg-black/60 text-white p-4 rounded-lg border border-white/10 font-mono whitespace-pre-line">
            {prompt.prompt_text}
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-2">Created: {new Date(prompt.created_at).toLocaleDateString()}</div>
        <Link to="/" className="text-blue-400 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
} 