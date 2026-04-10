import { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'New passwords do not match!' });
    }

    if (formData.oldPassword === formData.newPassword) {
      return setStatus({ type: 'error', message: 'New password cannot be the same as your current password!' });
    }
    setIsLoading(true);
    try {
      await api.post('/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      if (err.response?.data?.details) {
        setStatus({ type: 'error', message: err.response.data.details[0].message });
      } else {
        setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update password.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
          <div className="bg-gray-100 p-3 rounded-full text-gray-600">
            <KeyRound size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Security Settings</h1>
            <p className="text-gray-500">Update your account password</p>
          </div>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-lg text-sm border ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input required type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input required minLength={8} maxLength={16} type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="8-16 chars, 1 uppercase, 1 special char" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center rounded-lg bg-gray-800 px-4 py-3 font-semibold text-white hover:bg-gray-900 transition disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;