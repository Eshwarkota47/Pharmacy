import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext';

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}&emergency=${emergencyMode}`);
    }
  };

  const recentSearches = [
    'Paracetamol',
    'Azithromycin',
    'Omeprazole',
    'Metformin'
  ];

  const quickActions = [
    { title: 'Lookup Medicine', icon: '🔍', action: () => document.getElementById('search-input').focus() },
    { title: 'Dispense Queue', icon: '📋', action: () => navigate('/reservations') },
    { title: 'Check Inventory', icon: '📍', action: () => setSearchQuery('') },
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="user-dashboard">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-gray-600">Pharmacy Staff Workflow Assistant</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Medicine Lookup During Dispensing
              </label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Enter medicine name (brand or generic)..."
                data-testid="medicine-search-input"
              />
            </div>

            {/* Urgent Dispensing Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <div className="font-semibold text-gray-900">Urgent Dispensing Mode</div>
                  <div className="text-sm text-gray-600">
                    Priority routing for critical prescriptions with immediate availability
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                  emergencyMode ? 'bg-red-600' : 'bg-gray-300'
                }`}
                data-testid="emergency-mode-toggle"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    emergencyMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
              data-testid="search-submit-button"
            >
              🔍 Check Availability
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Workflow Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition"
                >
                  <span className="text-3xl">{action.icon}</span>
                  <span className="font-semibold text-gray-900">{action.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Lookups</h2>
            <div className="space-y-3">
              {recentSearches.map((medicine, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(medicine);
                    navigate(`/search?query=${encodeURIComponent(medicine)}&emergency=false`);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💊</span>
                    <span className="font-medium text-gray-900">{medicine}</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl shadow-lg p-6">
            <div className="text-3xl mb-3">🏪</div>
            <h3 className="text-xl font-bold mb-2">25+ Locations</h3>
            <p className="text-blue-100">Connected pharmacy and dispensary sites</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl shadow-lg p-6">
            <div className="text-3xl mb-3">💊</div>
            <h3 className="text-xl font-bold mb-2">100+ Medicines</h3>
            <p className="text-green-100">Real-time inventory tracking</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl shadow-lg p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Guidance</h3>
            <p className="text-purple-100">Smart substitute recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
