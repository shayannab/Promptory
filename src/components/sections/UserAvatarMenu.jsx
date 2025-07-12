import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'react-icons/lu';

export default function UserAvatarMenu() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndAvatar = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setUser(null);
        setAvatarUrl('');
        setLoading(false);
        return;
      }
      setUser(userData.user);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userData.user.id)
        .single();
      setAvatarUrl(profileData?.avatar_url || '/default-avatar.png');
      setLoading(false);
    };
    fetchUserAndAvatar();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }
  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setDropdownOpen((v) => !v)}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-10 h-10 rounded-full shadow object-cover bg-gray-100 border border-gray-200"
          onError={(e) => (e.target.src = '/default-avatar.png')}
        />
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 py-2 flex flex-col"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
            onClick={() => setDropdownOpen(false)}
          >
            Profile Settings
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-xl"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
} 