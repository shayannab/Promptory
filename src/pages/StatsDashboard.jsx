import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useUser } from '../utils/UserContext';
import { Link } from 'react-router-dom';

export default function StatsDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    total: 0,
    shared: 0,
    mostUsedCategory: '-',
    lastEdited: '-',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      setLoading(false);
      return;
    }
    const total = data.length;
    const shared = data.filter(p => p.is_public).length;
    const categoryCount = {};
    let lastEdited = null;
    data.forEach(p => {
      if (p.category) {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
      }
      if (!lastEdited || new Date(p.updated_at || p.created_at) > new Date(lastEdited)) {
        lastEdited = p.updated_at || p.created_at;
      }
    });
    let mostUsedCategory = '-';
    if (Object.keys(categoryCount).length > 0) {
      mostUsedCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0];
    }
    setStats({
      total,
      shared,
      mostUsedCategory,
      lastEdited: lastEdited ? new Date(lastEdited).toLocaleString() : '-',
    });
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Please log in to view your stats.</h2>
          <Link to="/login" className="text-blue-400 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg sm:max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-8 text-center">📊 Your Prompt Stats</h1>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-lg text-gray-400 mb-1">Total Prompts</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-lg text-gray-400 mb-1">Prompts Shared</div>
              <div className="text-3xl font-bold text-white">{stats.shared}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center">
              <div className="text-3xl mb-2">🏷️</div>
              <div className="text-lg text-gray-400 mb-1">Most-used Category</div>
              <div className="text-2xl font-bold text-white">{stats.mostUsedCategory}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center">
              <div className="text-3xl mb-2">⏰</div>
              <div className="text-lg text-gray-400 mb-1">Last Edited</div>
              <div className="text-md font-bold text-white">{stats.lastEdited}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 