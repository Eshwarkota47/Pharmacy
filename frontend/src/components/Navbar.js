import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MediGuide AI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
                  Home
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user.role === 'user' && (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                      Staff Dashboard
                    </Link>
                    <Link to="/reservations" className="text-gray-700 hover:text-primary-600 transition">
                      Dispense Queue
                    </Link>
                  </>
                )}
                {user.role === 'pharmacy' && (
                  <Link to="/pharmacy-dashboard" className="text-gray-700 hover:text-primary-600 transition">
                    Pharmacy Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin-dashboard" className="text-gray-700 hover:text-primary-600 transition">
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary-600 transition text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
