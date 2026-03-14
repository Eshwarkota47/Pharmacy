import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, pharmRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/dashboard`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/pharmacies`)
      ]);

      const [dashData, pharmData] = await Promise.all([
        dashRes.json(),
        pharmRes.json()
      ]);

      setDashboard(dashData);
      setPharmacies(pharmData.pharmacies || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyPharmacy = async (pharmacyId, verified) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/pharmacies/${pharmacyId}/verify?verified=${verified}`, {
        method: 'PUT'
      });
      fetchData();
    } catch (error) {
      console.error('Error verifying pharmacy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold mb-1">{dashboard.total_users}</div>
            <p className="text-blue-100">Total Users</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">🏪</div>
            <div className="text-3xl font-bold mb-1">{dashboard.total_pharmacies}</div>
            <p className="text-green-100">Pharmacies</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">💊</div>
            <div className="text-3xl font-bold mb-1">{dashboard.total_medicines}</div>
            <p className="text-purple-100">Medicines</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-3xl font-bold mb-1">{dashboard.total_reservations}</div>
            <p className="text-orange-100">Reservations</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'overview'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pharmacies')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'pharmacies'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pharmacy Management
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Analytics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Pending Reservations</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboard.pending_reservations}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Active Pharmacies</p>
                  <p className="text-2xl font-bold text-green-600">{dashboard.total_pharmacies}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {dashboard.recent_reservations && dashboard.recent_reservations.slice(0, 5).map((res, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">New Reservation</p>
                      <p className="text-sm text-gray-600">{new Date(res.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      res.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pharmacies Tab */}
        {activeTab === 'pharmacies' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pharmacy Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Pharmacy Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Verified</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacies.map((pharmacy) => (
                    <tr key={pharmacy.pharmacy_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{pharmacy.name}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{pharmacy.locality}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{pharmacy.contact}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          pharmacy.status === 'open' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pharmacy.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {pharmacy.verified ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {!pharmacy.verified ? (
                          <button
                            onClick={() => verifyPharmacy(pharmacy.pharmacy_id, true)}
                            className="text-green-600 hover:text-green-700 text-sm font-semibold"
                          >
                            Verify
                          </button>
                        ) : (
                          <button
                            onClick={() => verifyPharmacy(pharmacy.pharmacy_id, false)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            Unverify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;