import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../utils/UserContext';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastLoginEmail');
    if (stored) setLastEmail(stored);
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailNotConfirmed(false);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
        setEmailNotConfirmed(true);
        toast.error(`Please confirm your email to continue. We sent a confirmation link to ${email}.`);
      } else {
        toast.error(error.message);
      }
    } else {
      localStorage.setItem('lastLoginEmail', email);
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };

  const handleLoginAs = () => {
    setEmail(lastEmail);
    setLastEmail('');
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail);
    setForgotLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email to reset password!');
      setShowForgot(false);
      setForgotEmail('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Login</h2>
        {lastEmail && !email && (
          <div className="mb-4 text-blue-300 text-sm cursor-pointer" onClick={handleLoginAs}>
            Log in as <b>{lastEmail}</b>?
          </div>
        )}
        <input
          ref={emailInputRef}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:outline-none"
          required
        />
        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:outline-none pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 focus:outline-none"
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <span role="img" aria-label="Hide">🙈</span>
            ) : (
              <span role="img" aria-label="Show">👁️</span>
            )}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-gray-400 text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </div>
        <div className="mt-2 text-center">
          <button type="button" className="text-blue-400 hover:underline text-sm" onClick={() => setShowForgot(v => !v)}>
            Forgot password?
          </button>
        </div>
        {showForgot && (
          <div className="mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              className="w-full mb-2 px-4 py-3 rounded-lg bg-white/5 text-white dark:text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-80 placeholder-gray-300 dark:placeholder-gray-400"
              required
            />
            <button
              type="button"
              onClick={handleForgot}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={forgotLoading}
            >
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
} 