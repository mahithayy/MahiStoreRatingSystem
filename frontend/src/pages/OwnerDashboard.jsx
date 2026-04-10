import { useState, useEffect } from 'react';
import { Star, Users, Store as StoreIcon, Loader2 } from 'lucide-react';
import api from '../services/api';

const OwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Hits your store.routes.js -> getStoreRatings function
        const response = await api.get('/store');
        setStoreData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load store data. Are you sure an Admin has assigned a store to your account?'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  // If the backend returns a 404 because this owner hasn't been given a store yet
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-200 text-center max-w-2xl mx-auto mt-10">
        <StoreIcon size={48} className="mx-auto mb-4 text-red-400" />
        <h2 className="text-2xl font-bold mb-2">No Store Found</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!storeData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="bg-orange-100 text-orange-600 p-4 rounded-xl">
          <StoreIcon size={36} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{storeData.storeName}</h1>
          <p className="text-gray-500 font-medium mt-1">Store Owner Dashboard</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center space-x-5 hover:shadow-md transition">
          <div className="p-4 bg-yellow-50 text-yellow-500 rounded-xl">
            <Star size={32} className="fill-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Average Rating</p>
            <p className="text-3xl font-bold text-gray-800">
              {storeData.avgRating > 0 ? storeData.avgRating.toFixed(1) : '0'} <span className="text-lg text-gray-400 font-normal">/ 5</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center space-x-5 hover:shadow-md transition">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Reviews</p>
            <p className="text-3xl font-bold text-gray-800">{storeData.ratings.length}</p>
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">User Ratings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rating Given</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {storeData.ratings.length === 0 ? (
                <tr><td colSpan="3" className="text-center p-8 text-gray-500">No one has rated your store yet.</td></tr>
              ) : (
                storeData.ratings.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{review.user.name}</td>
                    <td className="p-4 text-gray-500">{review.user.email}</td>
                    <td className="p-4">
                      <span className="flex items-center font-bold text-gray-800 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg w-max">
                        {review.rating} <Star size={16} className="ml-1 text-yellow-500 fill-yellow-500" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;