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
    <div className="flex min-h-screen flex-col xl:flex-row items-center justify-center bg-gray-50 p-4 lg:p-8 gap-8">

      {/* --- Main Login Card --- */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100 shrink-0">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white mb-4 shadow-md">
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
            className="w-full flex mt-2 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 transition-all shadow-sm"
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
      <div className="w-full max-w-4xl bg-white text-gray-800 rounded-2xl shadow-lg p-6 lg:p-10 border border-gray-100">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Info size={24} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-800">Reviewer Testing Guide</h2>
        </div>
        <p className="text-gray-500 mb-8 text-sm">Use the credentials below to explore the role-based features of the application.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Admin Column */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <h3 className="text-lg font-bold text-blue-600 mb-3 border-b border-gray-200 pb-2">System Admin</h3>
            <div className="mb-4 bg-white p-3 rounded border border-gray-100 shadow-sm">
              <p className="text-sm"><span className="text-gray-400 font-medium">Email:</span> <span className="font-semibold text-gray-700">admin@mahitha.com</span></p>
              <p className="text-sm"><span className="text-gray-400 font-medium">Pass:</span> <span className="font-semibold text-gray-700">SuperSecret1!</span></p>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>View system-wide dashboard</li>
              <li>CRUD operations for Users</li>
              <li>CRUD operations for Stores</li>
              <li>Assign Store Owners dynamically</li>
            </ul>
          </div>

          {/* Store Owner Column */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors">
            <h3 className="text-lg font-bold text-orange-600 mb-3 border-b border-gray-200 pb-2">Store Owner</h3>
            <div className="mb-4 bg-white p-3 rounded border border-gray-100 shadow-sm">
              <p className="text-sm"><span className="text-gray-400 font-medium">Email:</span> <span className="font-semibold text-gray-700">store@owner.com</span></p>
              <p className="text-sm"><span className="text-gray-400 font-medium">Pass:</span> <span className="font-semibold text-gray-700">ownerPass!</span></p>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>View specific store statistics</li>
              <li>See live average ratings</li>
              <li>Read reviews from customers</li>
              <li>Reply directly to customer reviews</li>
            </ul>
          </div>

          {/* Normal User Column */}
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 relative overflow-hidden hover:border-green-300 transition-colors">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">START HERE</div>
            <h3 className="text-lg font-bold text-green-600 mb-3 border-b border-blue-100 pb-2">Normal User</h3>
            <p className="text-sm mb-4 text-gray-600 italic bg-white p-3 rounded border border-blue-50 shadow-sm">
              Sign up manually via the <strong>"Register here"</strong> link to test strict Zod form validation.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Discover and search all stores</li>
              <li>Submit 1-5 star ratings</li>
              <li>Edit or update previous ratings</li>
            </ul>
          </div>

        </div>

        {/* --- Highlighted Profile Tip --- */}
        <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start space-x-3">
          <div className="text-indigo-600 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
          </div>
          <p className="text-sm text-indigo-900 leading-relaxed">
            <span className="font-bold uppercase tracking-wider text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded mr-2">Testing Tip</span>
            Every user role can securely update their credentials. Log in to any account and click the <strong>"Profile"</strong> button in the top navigation bar to test the backend password validation logic.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;