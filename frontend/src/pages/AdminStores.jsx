import { useState, useEffect } from 'react';
import { Search, Plus, ArrowUpDown, X, Loader2, Store } from 'lucide-react';
import api from '../services/api';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Sorting
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  // Modal & Owner Selection State
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [modalError, setModalError] = useState('');
  const [availableOwners, setAvailableOwners] = useState([]);

  const [formData, setFormData] = useState({
    name: '', email: '', address: '', ownerId: ''
  });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stores', {
        params: { search, sortBy, order }
      });
      setStores(response.data);
    } catch (err) {
      console.error("Failed to fetch stores", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users who are Store Owners for the dropdown
  const fetchOwners = async () => {
    try {
      const response = await api.get('/admin/users', { params: { role: 'STORE_OWNER' } });
      setAvailableOwners(response.data);
    } catch (err) {
      console.error("Failed to fetch owners", err);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchOwners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleSort = (field) => {
    const newOrder = (sortBy === field && order === 'asc') ? 'desc' : 'asc';
    setSortBy(field);
    setOrder(newOrder);
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsAdding(true);
    try {
      await api.post('/admin/stores', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
    } catch (err) {
      if (err.response?.data?.details) {
        setModalError(err.response.data.details[0].message);
      } else {
        setModalError(err.response?.data?.message || err.response?.data?.error || 'Failed to add store.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Helper function to calculate average rating
  const getAvgRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 'No ratings';
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1) + ' ⭐';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Stores</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={20} className="mr-2" /> Add New Store
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearchSubmit} className="flex w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <button type="submit" className="ml-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium">Search</button>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                <th className="p-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Store Name <ArrowUpDown size={14} className="ml-1" /></div>
                </th>
                <th className="p-4">Owner</th>
                <th className="p-4">Email</th>
                <th className="p-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('address')}>
                  <div className="flex items-center">Address <ArrowUpDown size={14} className="ml-1" /></div>
                </th>
                <th className="p-4">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="text-center p-8"><Loader2 className="animate-spin mx-auto text-green-600" size={32} /></td></tr>
              ) : stores.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-8 text-gray-500">No stores found.</td></tr>
              ) : (
                stores.map(store => (
                  <tr key={store.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800 flex items-center">
                      <Store size={16} className="text-gray-400 mr-2" />
                      {store.name}
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{store.owner?.name || 'Unknown'}</td>
                    <td className="p-4 text-gray-500">{store.email}</td>
                    <td className="p-4 text-gray-500 truncate max-w-xs">{store.address}</td>
                    <td className="p-4 font-semibold text-gray-700">{getAvgRating(store.ratings)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Store Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Add New Store</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddStore} className="p-6 space-y-4">
              {modalError && <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">{modalError}</div>}

              <div>
                <label className="block text-sm font-medium mb-1">Store Name</label>
                <input required minLength={2} maxLength={100} type="text" className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Store Name"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input required type="email" className="w-full border rounded-lg px-3 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input required maxLength={400} type="text" className="w-full border rounded-lg px-3 py-2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign to Store Owner</label>
                <select required className="w-full border rounded-lg px-3 py-2" value={formData.ownerId} onChange={e => setFormData({...formData, ownerId: e.target.value})}>
                  <option value="" disabled>Select an Owner...</option>
                  {availableOwners.map(owner => (
                    <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                  ))}
                </select>
                {availableOwners.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No Store Owners found. Create one in Manage Users first!</p>
                )}
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isAdding || availableOwners.length === 0} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                  {isAdding ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Save Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;