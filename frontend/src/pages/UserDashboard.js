import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext';

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingQueue, setPendingQueue] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch low stock items and recent activity
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate fetching low stock items
      setLowStockItems([
        { medicine: 'Amoxicillin 500mg', quantity: 12, status: 'low_stock' },
        { medicine: 'Metformin 850mg', quantity: 8, status: 'low_stock' },
        { medicine: 'Omeprazole 20mg', quantity: 15, status: 'low_stock' },
      ]);
      
      // Simulate recent activity
      setRecentActivity([
        { action: 'Dispensed', medicine: 'Paracetamol 650mg', time: '2 mins ago' },
        { action: 'Checked', medicine: 'Azithromycin 500mg', time: '5 mins ago' },
        { action: 'Substituted', medicine: 'Ibuprofen 400mg', time: '12 mins ago' },
        { action: 'Urgent', medicine: 'Amlodipine 5mg', time: '18 mins ago' },
      ]);

      setPendingQueue(3);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}&emergency=${emergencyMode}`);
    }
  };

  const frequentlyChecked = [
    { name: 'Paracetamol 650mg', category: 'Painkiller' },
    { name: 'Azithromycin 500mg', category: 'Antibiotic' },
    { name: 'Metformin 850mg', category: 'Diabetes' },
    { name: 'Amlodipine 5mg', category: 'Blood Pressure' },
  ];

  const criticalMedicines = [
    { name: 'Adrenaline (Epinephrine)', status: 'in_stock', location: 'Emergency Cart' },
    { name: 'Atropine', status: 'in_stock', location: 'Emergency Cart' },
    { name: 'Insulin (Rapid)', status: 'low_stock', location: 'Refrigerator' },
    { name: 'Naloxone', status: 'in_stock', location: 'Emergency Kit' },
  ];

  const quickActions = [
    { title: 'Urgent Lookup', icon: '🚨', color: 'red', action: () => { setEmergencyMode(true); document.getElementById('search-input').focus(); } },
    { title: 'AI Substitutes', icon: '🤖', color: 'purple', action: () => navigate('/search?query=&emergency=false') },
    { title: 'Check Queue', icon: '📋', color: 'blue', action: () => navigate('/reservations') },
    { title: 'Low Stock', icon: '⚠️', color: 'orange', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="user-dashboard">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Workflow Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {user?.name} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg px-4 py-2">
                <div className="text-xs text-green-600 font-semibold">PHARMACY STATUS</div>
                <div className="text-lg font-bold text-green-800 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  OPEN
                </div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-600 font-semibold">PENDING QUEUE</div>
                <div className="text-lg font-bold text-blue-800">{pendingQueue} Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`bg-${action.color}-50 hover:bg-${action.color}-100 border-2 border-${action.color}-200 rounded-xl p-4 transition duration-200 transform hover:scale-105`}
              style={{
                backgroundColor: action.color === 'red' ? '#FEF2F2' : 
                                 action.color === 'purple' ? '#FAF5FF' : 
                                 action.color === 'blue' ? '#EFF6FF' : '#FFF7ED',
                borderColor: action.color === 'red' ? '#FECACA' : 
                             action.color === 'purple' ? '#E9D5FF' : 
                             action.color === 'blue' ? '#BFDBFE' : '#FED7AA'
              }}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="font-bold text-gray-900 text-sm">{action.title}</div>
            </button>
          ))}
        </div>

        {/* Main Search Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Medicine Lookup for Dispensing
                </label>
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Type medicine name (brand or generic)..."
                  data-testid="medicine-search-input"
                />
              </div>
              <button
                type="submit"
                className="mt-7 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg"
                data-testid="search-submit-button"
              >
                Check Availability
              </button>
            </div>

            {/* Urgent Dispensing Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🚨</span>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Urgent Dispensing Mode</div>
                  <div className="text-xs text-gray-600">
                    Priority routing for critical prescriptions
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                  emergencyMode ? 'bg-red-600' : 'bg-gray-300'
                }`}
                data-testid="emergency-mode-toggle"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    emergencyMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </form>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Frequently Checked Medicines */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">⚡ Frequently Checked Medicines</h2>
                <span className="text-xs text-gray-500">Quick Access</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {frequentlyChecked.map((med, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(med.name);
                      navigate(`/search?query=${encodeURIComponent(med.name)}&emergency=false`);
                    }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 text-sm">{med.name}</div>
                      <div className="text-xs text-gray-500">{med.category}</div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Workflow Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">📊 Recent Workflow Activity</h2>
                <span className="text-xs text-gray-500">Last 30 minutes</span>
              </div>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        activity.action === 'Urgent' ? 'bg-red-100 text-red-800' :
                        activity.action === 'Dispensed' ? 'bg-green-100 text-green-800' :
                        activity.action === 'Checked' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {activity.action}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{activity.medicine}</span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Substitute Suggestions Panel */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">🤖</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">AI Substitute Guidance</h2>
                  <p className="text-sm text-gray-600">Get intelligent alternatives when medicine unavailable</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/search?query=&emergency=false')}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Request AI Substitute Suggestions
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">⚠️ Low Stock Alerts</h2>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                  {lowStockItems.length} Items
                </span>
              </div>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="font-semibold text-gray-900 text-sm mb-1">{item.medicine}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-orange-700">Only {item.quantity} left</span>
                      <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-semibold">
                        LOW
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Medicines Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">🏥 Critical Medicines</h2>
                <span className="text-xs text-gray-500">Emergency Stock</span>
              </div>
              <div className="space-y-2">
                {criticalMedicines.map((med, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{med.name}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        med.status === 'in_stock' ? 'bg-green-500' : 'bg-orange-500'
                      }`}></span>
                    </div>
                    <div className="text-xs text-gray-600">{med.location}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Dispense Queue */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">📋 Active Queue</h2>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {pendingQueue}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {pendingQueue} prescriptions pending in dispense queue
              </p>
              <button
                onClick={() => navigate('/reservations')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
              >
                View Queue →
              </button>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">🔧 System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Inventory System</span>
                  <span className="flex items-center text-green-600 font-semibold text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Assistant</span>
                  <span className="flex items-center text-green-600 font-semibold text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Real-time Sync</span>
                  <span className="flex items-center text-green-600 font-semibold text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Synced
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-3xl font-bold mb-1">25</div>
            <p className="text-blue-100">Connected Locations</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">💊</div>
            <div className="text-3xl font-bold mb-1">1,247</div>
            <p className="text-green-100">Real-time Inventory Items</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">🤖</div>
            <div className="text-3xl font-bold mb-1">AI</div>
            <p className="text-purple-100">Substitute Guidance Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
