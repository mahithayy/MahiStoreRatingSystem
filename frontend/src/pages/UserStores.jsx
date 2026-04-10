import { useState, useEffect, useContext } from 'react';
import { Search, Store, Star, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const UserStores = () => {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [submittingId, setSubmittingId] = useState(null); // Tracks which store is currently being rated

  const fetchStores = async () => {
    try {
      // Hits your user.routes.js -> getStores function
      const response = await api.get('/user/stores');
      setStores(response.data);
    } catch (err) {
      console.error("Failed to fetch stores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRate = async (storeId, ratingValue) => {
    setSubmittingId(storeId);
    try {
      // Hits your user.routes.js -> submitRating function
      await api.post('/user/rate', { storeId, rating: ratingValue });
      await fetchStores(); // Refresh the list to show the new average and your updated rating
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingId(null);
    }
  };

  // Helper to calculate the overall average rating for a store
  const getAvgRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Helper to find what the currently logged-in user rated this specific store
  const getMyRating = (ratings) => {
    if (!ratings) return 0;
    const myRatingObj = ratings.find(r => r.userId === user.id);
    return myRatingObj ? myRatingObj.rating : 0;
  };

  // Filter stores based on the search bar
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Discover Stores</h1>
          <p className="text-gray-500 mt-1">Find and rate your favorite local stores.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center border-dashed">
          <Store size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No stores found</h2>
          <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => {
            const avgRating = getAvgRating(store.ratings);
            const myRating = getMyRating(store.ratings);

            return (
              <div key={store.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                      <Store size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 leading-tight">{store.name}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-[180px]">{store.address}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="flex items-center font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded-lg">
                      {avgRating > 0 ? avgRating : '-'} <Star size={16} className="ml-1 text-yellow-500 fill-yellow-500" />
                    </span>
                    <span className="text-xs text-gray-400 mt-1">{store.ratings.length} reviews</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {myRating > 0 ? "Your Rating:" : "Rate this store:"}
                  </p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        disabled={submittingId === store.id}
                        onClick={() => handleRate(store.id, starValue)}
                        className={`p-1 rounded-full focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 ${
                          submittingId === store.id ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <Star
                          size={24}
                          className={`transition-colors ${
                            starValue <= myRating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 hover:text-yellow-200"
                          }`}
                        />
                      </button>
                    ))}
                    {submittingId === store.id && <Loader2 className="animate-spin text-blue-600 ml-2" size={16} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserStores;