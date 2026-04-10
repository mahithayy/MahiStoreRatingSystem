import { useState, useEffect } from 'react';
import { Search, Plus, Filter, ArrowUpDown, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Sorting State
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [modalError, setModalError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '', role: 'USER'
  });

  // Fetch users whenever filters or sorting change
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: { search, role, sortBy, order }
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, sortBy, order]); // We will trigger search manually via button to prevent spamming the API

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleSort = (field) => {
    const newOrder = (sortBy === field && order === 'asc') ? 'desc' : 'asc';
    setSortBy(field);
    setOrder(newOrder);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsAdding(true);
    try {
      await api.post('/admin/users', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', address: '', role: 'USER' }); // reset
      fetchUsers(); // Refresh the table
    } catch (err) {
      let errorMsg = err.response?.data?.details
        ? err.response.data.details[0].message
        : (err.response?.data?.message || err.response?.data?.error || 'Failed to add user.');

      // Friendly Error Translations
      if (errorMsg.includes('Unique constraint failed') && errorMsg.includes('email')) {
        errorMsg = 'A user with this email already exists.';
      } else if (errorMsg.includes('/[A-Z]/')) {
        errorMsg = 'Password must contain at least one uppercase letter.';
      } else if (errorMsg.includes('/[^A-Za-z0-9]/')) {
        errorMsg = 'Password must contain at least one special character (e.g., !@#$%).';
      }

      setModalError(errorMsg);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" /> Add New User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <button type="submit" className="ml-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium">Search</button>
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter size={20} className="text-gray-500" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                <th className="p-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Name <ArrowUpDown size={14} className="ml-1" /></div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('email')}>
                  <div className="flex items-center">Email <ArrowUpDown size={14} className="ml-1" /></div>
                </th>
                <th className="p-4">Role</th>
                <th className="p-4">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="text-center p-8"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-8 text-gray-500">No users found.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'STORE_OWNER' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 truncate max-w-xs">{u.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {modalError && <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">{modalError}</div>}

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required minLength={20} maxLength={60} type="text" className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Min 20 characters..."/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" className="w-full border rounded-lg px-3 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input required minLength={8} maxLength={16} type="password" className="w-full border rounded-lg px-3 py-2" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="8-16 chars, 1 Uppercase, 1 Special"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input required maxLength={400} type="text" className="w-full border rounded-lg px-3 py-2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="w-full border rounded-lg px-3 py-2" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="USER">Normal User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isAdding} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  {isAdding ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;