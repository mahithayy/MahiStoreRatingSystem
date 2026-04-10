import React,{ useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, UserCircle, Store } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2 text-blue-600">
        <Store size={28} />
        <span className="text-xl font-bold text-gray-800">StoreRater</span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Display the user's role */}
        <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
          <UserCircle size={18} className="mr-2" />
          {user?.role === 'STORE_OWNER' ? 'Store Owner' : user?.role === 'ADMIN' ? 'Admin' : 'User'}
        </div>
<Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium transition mr-4">
          Profile
        </Link>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center text-red-600 hover:text-red-800 transition-colors font-medium"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;