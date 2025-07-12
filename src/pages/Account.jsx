import { useState, useEffect } from 'react';
import { useUser } from '../utils/UserContext';
import { supabase } from '../utils/supabaseClient';
import ConfirmModal from '../components/sections/confirmModal';
import toast from 'react-hot-toast';

function InputField({ label, type = 'text', value, onChange, disabled = false, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black disabled:bg-gray-100"
        {...props}
      />
    </div>
  );
}

function Button({ children, onClick, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Account() {
  const { user, signOut } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name: '', email: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, email, avatar_url')
      .eq('id', user.id)
      .single();
    if (error) {
      toast.error('Failed to load profile');
      setLoading(false);
      return;
    }
    setProfile(data);
    setForm({ full_name: data.full_name || '', email: data.email || user.email });
    setAvatarUrl(data.avatar_url || '');
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'email' && value !== user.email) setEmailChanged(true);
    else if (name === 'email') setEmailChanged(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    // Validate email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      toast.error('Invalid email format');
      setUpdating(false);
      return;
    }
    // Update profile in profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, email: form.email, avatar_url: avatarUrl })
      .eq('id', user.id);
    if (error) {
      toast.error('Failed to update profile');
      setUpdating(false);
      return;
    }
    // If email changed, update in auth as well
    if (emailChanged) {
      const { error: authError } = await supabase.auth.updateUser({ email: form.email });
      if (authError) {
        toast.error('Failed to update email in auth');
        setUpdating(false);
        return;
      }
      toast.success('Profile and email updated! Please check your inbox to confirm new email.');
    } else {
      toast.success('Profile updated!');
    }
    setUpdating(false);
    fetchProfile();
  };

  const handlePasswordReset = async () => {
    if (!user.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) toast.error(error.message);
    else toast.success('Check your email to reset your password.');
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast.error('Avatar upload failed');
      setAvatarUploading(false);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);
    setAvatarUploading(false);
    toast.success('Avatar updated!');
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    // Delete from profiles table
    const { error } = await supabase.from('profiles').delete().eq('id', user.id);
    if (error) {
      toast.error('Failed to delete profile');
      return;
    }
    // Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    if (authError) {
      toast.error('Failed to delete user from auth');
      return;
    }
    toast.success('Account deleted');
    signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Profile Settings</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2 border-4 border-blue-200">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-4xl text-gray-400">👤</span>
              )}
            </div>
            <label className="text-blue-600 cursor-pointer text-sm font-semibold">
              {avatarUploading ? 'Uploading...' : 'Change Avatar'}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
            </label>
          </div>
          <InputField
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            disabled={updating}
            maxLength={60}
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={updating}
            required
          />
          <Button type="button" onClick={handlePasswordReset} className="mb-2 bg-gradient-to-r from-gray-600 to-gray-800">
            Change Password
          </Button>
          <Button type="submit" disabled={updating}>
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <Button type="button" onClick={() => setShowDeleteModal(true)} className="bg-gradient-to-r from-red-500 to-red-700">
            Delete Account
          </Button>
        </div>
      </div>
      <ConfirmModal
        show={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
} 