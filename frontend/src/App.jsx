import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Signup from './pages/Signup';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import UserStores from './pages/UserStores';
import Login from './pages/Login';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import Profile from './pages/Profile';
// Temporary Placeholder Components
//const AdminDashboard = () => <Layout><div className="p-10 text-2xl font-bold">Admin Dashboard </div></Layout>;
//const OwnerDashboard = () => <Layout><div className="p-10 text-2xl font-bold">Store Owner Dashboard </div></Layout>;
//const UserDashboard = () => <Layout><div className="p-10 text-2xl font-bold">User Stores List </div></Layout>;
// A simple wrapper to protect routes from unlogged users
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
           <Route path="/signup" element={<Signup />} />

          {/* Protected Routes based on Role */}
          <Route path="/admin/*" element={
         <ProtectedRoute allowedRoles={['ADMIN']}>
           <Layout>
             <Routes>
               <Route path="/" element={<AdminDashboard />} />
               <Route path="/users" element={<AdminUsers />} />
               <Route path="/stores" element={<AdminStores />} />
             </Routes>
           </Layout>
         </ProtectedRoute>
       } />

          <Route path="/owner/*" element={
            <ProtectedRoute allowedRoles={['STORE_OWNER']}>
              <Layout>
                <Routes>
                  <Route path="/" element={<OwnerDashboard />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/stores/*" element={
         <ProtectedRoute allowedRoles={['USER']}>
           <Layout>
             <Routes>
               <Route path="/" element={<UserStores />} />
             </Routes>
           </Layout>
         </ProtectedRoute>
       } />
       <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'STORE_OWNER', 'USER']}>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;