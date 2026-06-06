import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store, Loader2, Info } from 'lucide-react';
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
      const response = await api.post('/auth/login', { email, password });
      login({ id: response.data.id, role: response.data.role });

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
    <div className="flex min-h-screen flex-col xl:flex-row items-center justify-center bg-gray-100 p-4 lg:p-8 gap-8">

      {/* --- Main Login Card --- */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shrink-0">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white mb-4 shadow-lg">
            <Store size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-center mt-1">
            Sign in to <span className="font-bold text-gray-700">Mahitha's Store Rating System</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
            className="w-full flex mt-2 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 transition-all shadow-md"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors hover:underline">
            Register here
          </Link>
        </div>
      </div>

      {/* --- Reviewer Guide Side Panel --- */}
      <div className="w-full max-w-4xl bg-slate-900 text-slate-300 rounded-2xl shadow-2xl p-6 lg:p-10 border border-slate-700">
        <div className="flex items-center space-x-3 mb-2">
          <Info size={28} className="text-blue-400" />
          <h2 className="text-2xl font-bold tracking-wide text-white">Reviewer Testing Guide</h2>
        </div>
        <p className="text-slate-400 mb-8 text-sm">Use the credentials below to explore the role-based features of the application.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Admin Column */}
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-inner">
            <h3 className="text-lg font-bold text-blue-400 mb-3 border-b border-slate-700 pb-2">Admin</h3>
            <p className="text-sm mb-1"><span className="font-medium text-slate-400">Email:</span> <span className="text-white">admin@mahitha.com</span></p>
            <p className="text-sm mb-4"><span className="font-medium text-slate-400">Pass:</span> <span className="text-white">SuperSecret1!</span></p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>View system-wide dashboard</li>
              <li>CRUD operations for Users</li>
              <li>CRUD operations for Stores</li>
              <li>Assign Store Owners dynamically</li>
            </ul>
          </div>

          {/* Store Owner Column */}
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-inner">
            <h3 className="text-lg font-bold text-orange-400 mb-3 border-b border-slate-700 pb-2">Store Owner</h3>
            <p className="text-sm mb-1"><span className="font-medium text-slate-400">Email:</span> <span className="text-white">store@owner.com</span></p>
            <p className="text-sm mb-4"><span className="font-medium text-slate-400">Pass:</span> <span className="text-white">ownerPass!</span></p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>View specific store statistics</li>
              <li>See live average ratings</li>
              <li>Read reviews from customers</li>
              <li>Reply directly to customer reviews</li>
            </ul>
          </div>

          {/* Normal User Column */}
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-bl-lg">START HERE</div>
            <h3 className="text-lg font-bold text-green-400 mb-3 border-b border-slate-700 pb-2">Normal User</h3>
            <p className="text-sm mb-4 text-slate-400 italic">Sign up manually via the "Register here" link to test strict Zod form validation.</p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Discover and search all stores</li>
              <li>Submit 1-5 star ratings</li>
              <li>Edit or update previous ratings</li>
              <li>Test account password updates</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;