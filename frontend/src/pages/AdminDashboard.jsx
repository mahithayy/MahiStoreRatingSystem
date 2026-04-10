import { useState, useEffect } from 'react';
import { Users, Store, Star, Loader2 } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';
const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the stats from your Render backend when the page loads
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Users Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
          </div>
        </div>

        {/* Stores Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <Store size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Stores</p>
            <p className="text-3xl font-bold text-gray-800">{stats.stores}</p>
          </div>
        </div>

        {/* Ratings Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl">
            <Star size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Ratings</p>
            <p className="text-3xl font-bold text-gray-800">{stats.ratings}</p>
          </div>
        </div>

      </div>


      {/* Management Quick Links */}
   <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
     <Link to="/admin/users" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-md transition group">
       <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
         <Users size={32} />
       </div>
       <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
       <p className="text-gray-500 mt-2">View, filter, sort, and add new users or store owners to the platform.</p>
     </Link>

     <Link to="/admin/stores" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:border-green-300 hover:shadow-md transition group cursor-pointer">
          <div className="bg-green-50 text-green-600 p-4 rounded-full mb-4 group-hover:bg-green-600 group-hover:text-white transition">
            <Store size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Manage Stores</h2>
          <p className="text-gray-500 mt-2">Create new stores and assign them to verified store owners.</p>
        </Link>
   </div>
    </div>
  );
};

export default AdminDashboard;