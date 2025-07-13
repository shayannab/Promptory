import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';
import { useUser } from '../utils/UserContext';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODELS = [
  { label: 'Llama 3 70B', value: 'llama3-70b-8192' },
  { label: 'Llama 3 8B', value: 'llama3-8b-8192' },
  { label: 'Gemma 7B IT', value: 'gemma-7b-it' },
];
const CHAR_LIMIT = 500;
const WORD_LIMIT = 100;

function countWords(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

export default function Playground() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0].value);
  const [typingResponse, setTypingResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [promptsRun, setPromptsRun] = useState(0);
  const [responseTime, setResponseTime] = useState(null);
  const textareaRef = useRef(null);

  const charCount = prompt.length;
  const wordCount = countWords(prompt);
  const tokenEstimate = Math.round(wordCount * 1.3);

  // Auto-expand textarea
  const handlePromptChange = (e) => {
    setPrompt(e.target.value.slice(0, CHAR_LIMIT));
    setTypingResponse('');
    setResponse('');
    setFeedback('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  // Keyboard shortcut
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e, isRegenerate = false) => {
    if (e) e.preventDefault();
    setTypingResponse('');
    setResponse('');
    setFeedback('');
    if (!prompt.trim()) {
      toast.error('Please enter a prompt.');
      return;
    }
    if (charCount > CHAR_LIMIT || wordCount > WORD_LIMIT) {
      toast.error('Prompt exceeds character or word limit.');
      return;
    }
    setLoading(true);
    setResponseTime(null);
    const start = performance.now();
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      const end = performance.now();
      setResponseTime(Math.round(end - start));
      if (!res.ok) {
        throw new Error(data?.error?.message || 'API error');
      }
      const fullResponse = data?.choices?.[0]?.message?.content?.trim() || 'No response.';
      setResponse(fullResponse);
      // Typing animation
      let i = 0;
      setTypingResponse('');
      function typeNext() {
        setTypingResponse((prev) => prev + fullResponse[i]);
        i++;
        if (i < fullResponse.length) {
          setTimeout(typeNext, 12);
        }
      }
      typeNext();
      setPromptsRun((n) => n + 1);
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setResponse('');
    setTypingResponse('');
    setFeedback('');
    setResponseTime(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleCopy = () => {
    if (response || typingResponse) {
      navigator.clipboard.writeText(response || typingResponse);
      toast.success('Copied ✅');
    }
  };

  const handleRegenerate = () => {
    handleSubmit(null, true);
  };

  const handleSavePrompt = async () => {
    if (!user) {
      toast.error('You must be logged in to save prompts.');
      return;
    }
    if (!prompt.trim() || !(response || typingResponse)) {
      toast.error('Prompt and response required.');
      return;
    }
    const { error } = await supabase.from('prompts').insert([
      {
        user_id: user.id,
        prompt_text: prompt,
        response_text: response || typingResponse,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      toast.error('Failed to save prompt.');
    } else {
      toast.success('Prompt saved!');
    }
  };

  const handleGetFeedback = async () => {
    setFeedbackLoading(true);
    setFeedback('');
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You are an expert prompt engineer. Rate the following prompt from 1-10 and suggest improvements. Reply in the format: "Rating: X/10\nImprovements: ..."' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'API error');
      }
      setFeedback(data?.choices?.[0]?.message?.content?.trim() || 'No feedback.');
    } catch (err) {
      toast.error(err.message || 'Failed to get feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-8 sm:py-12">
      <div className="bg-gray-900 p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-lg sm:max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-2xl font-bold mb-6 text-white text-center">Playground</h2>
        <div className="mb-4 text-right text-xs sm:text-sm text-orange-400 font-semibold">🔥 Prompts run: {promptsRun}</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="model" className="block text-xs sm:text-sm text-gray-300 mb-2">Model</label>
            <select
              id="model"
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-base"
              disabled={loading}
            >
              {MODELS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <textarea
            ref={textareaRef}
            className="w-full mb-2 px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-80 placeholder-gray-300 min-h-[100px] resize-none transition-all"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={CHAR_LIMIT}
            rows={1}
            required
          />
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{charCount} / {CHAR_LIMIT} chars • {wordCount} words</span>
            <span>Estimated tokens: {tokenEstimate}</span>
          </div>
          <div className="flex gap-3 mb-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  Running...
                </span>
              ) : (
                'Run Prompt'
              )}
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleClear}
              disabled={loading && !prompt}
            >
              Clear
            </button>
            <button
              type="button"
              className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleRegenerate}
              disabled={loading || !prompt}
            >
              Regenerate
            </button>
          </div>
        </form>
        {loading && (
          <div className="mt-6 p-6 rounded-lg bg-black/40 border border-white/10 animate-pulse min-h-[100px]">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        )}
        {(typingResponse || response) && !loading && (
          <div className="mt-6 p-4 rounded-lg bg-black/60 text-white border border-white/10 whitespace-pre-line relative">
            <b>AI Response:</b>
            <div className="mt-2 font-mono text-base min-h-[40px]">{typingResponse || response}</div>
            <div className="flex gap-2 mt-4">
              <button
                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold transition-all"
                onClick={handleCopy}
              >
                Copy to Clipboard
              </button>
              <button
                className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white rounded text-xs font-semibold transition-all"
                onClick={handleSavePrompt}
                disabled={loading || !user}
              >
                Save Prompt
              </button>
            </div>
            {responseTime !== null && (
              <div className="text-xs text-gray-400 mt-2">⏱ Response time: {responseTime}ms</div>
            )}
          </div>
        )}
        {(typingResponse || response) && !loading && (
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded font-semibold text-sm transition-all"
              onClick={handleGetFeedback}
              disabled={feedbackLoading}
            >
              {feedbackLoading ? 'Getting Feedback...' : 'Get Prompt Feedback'}
            </button>
            {feedback && (
              <div className="mt-4 p-4 rounded-lg bg-gray-800 text-white border border-white/10 whitespace-pre-line">
                <b>Prompt Feedback:</b>
                <div className="mt-2 font-mono text-base min-h-[20px]">{feedback}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 