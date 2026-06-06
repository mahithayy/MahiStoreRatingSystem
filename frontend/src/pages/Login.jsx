import { useState, useContext } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store, Loader2, Info } from 'lucide-react'; // Cool icons!
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Sending request to your Render backend
      const response = await api.post('/auth/login', { email, password });

      // Save token and state via Context
      login({ id: response.data.id, role: response.data.role });

      // Redirect based on the user's role
      if (response.data.role === 'ADMIN') navigate('/admin');
      else if (response.data.role === 'STORE_OWNER') navigate('/owner');
      else navigate('/stores');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white mb-4">
            <Store size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500">
            Sign in to <span className="font-bold text-gray-700">Mahitha's Store Rating System</span>
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-inner">
            <div className="flex items-center space-x-2 text-slate-700 mb-3">
              <Info size={18} className="text-blue-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Reviewer Testing Guide</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="bg-white p-3 rounded border border-slate-100">
                <p className="font-semibold text-purple-700 mb-1">Admin Access</p>
                <p><span className="font-medium">Email:</span> admin@mahitha.com</p>
                <p><span className="font-medium">Pass:</span> SuperSecret1!</p>
              </div>

              <div className="bg-white p-3 rounded border border-slate-100">
                <p className="font-semibold text-orange-600 mb-1">Store Owner Access</p>
                <p><span className="font-medium">Email:</span> store@owner.com</p>
                <p><span className="font-medium">Pass:</span> ownerPass!</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500 italic text-center">
              Tip: You can test the custom password validation rules by clicking the "Profile" button in the Navbar after logging in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;