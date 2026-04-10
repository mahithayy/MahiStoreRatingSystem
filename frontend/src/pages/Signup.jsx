import React,{ useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Loader2 } from 'lucide-react';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //  auto-login the user after they successfully register
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Register the user
      await api.post('/auth/register', formData);

      // 2. Automatically log them in right after successful registration
      const loginResponse = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // 3. Save token to context
      login(loginResponse.data.token, loginResponse.data.role);

      // 4. Redirect to the user dashboard
      navigate('/stores');

    } catch (err) {
      // If  backend Zod validation fails, it sends an array of details
      if (err.response?.data?.details) {
        // Grab the first validation error to show the user
        setError(err.response.data.details[0].message);
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl my-8">

        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
          <p className="text-gray-500">Join to rate and review stores</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              minLength={20}
              maxLength={60}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              value={formData.name}
              onChange={handleChange}
              placeholder="Must be at least 20 characters..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              required
              maxLength={400}
              rows="2"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your full address..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              maxLength={16}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              value={formData.password}
              onChange={handleChange}
              placeholder="8-16 chars, 1 uppercase, 1 special char"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex mt-2 items-center justify-center rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400 transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="font-semibold text-green-600 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;