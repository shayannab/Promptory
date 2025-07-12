import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../utils/UserContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signUp } = useUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signUp(email, password, { options: { data: { full_name: fullName } } });
    setLoading(false);
    if (error) {
      if (error.message && error.message.toLowerCase().includes('already registered')) {
        toast.error('An account with this email already exists. Try logging in.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Signup successful! Please check your email to confirm your account.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:outline-none"
          required
        />
        <input
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div className="mt-4 text-gray-400 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
} 