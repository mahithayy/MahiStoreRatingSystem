import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* The main page content will be injected here */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;