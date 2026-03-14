import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const pharmacyId = user?.pharmacy_id || 'c2ef04fb-c905-4927-a9f6-a510cc932ab0';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, resRes, anaRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pharmacy/inventory?pharmacy_id=${pharmacyId}`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pharmacy/reservations?pharmacy_id=${pharmacyId}`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pharmacy/analytics?pharmacy_id=${pharmacyId}`)
      ]);

      const [invData, resData, anaData] = await Promise.all([
        invRes.json(),
        resRes.json(),
        anaRes.json()
      ]);

      setInventory(invData.inventory || []);
      setReservations(resData.reservations || []);
      setAnalytics(anaData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pharmacy/reservations/${reservationId}/status?status=${status}`, {
        method: 'PUT'
      });
      fetchData();
    } catch (error) {
      console.error('Error updating reservation:', error);
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
    <div className="min-h-screen bg-gray-50" data-testid="pharmacy-dashboard">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pharmacy Dashboard</h1>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">💊</span>
              <span className="text-3xl font-bold text-primary-600">{analytics.total_medicines}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Medicines</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">⚠️</span>
              <span className="text-3xl font-bold text-orange-600">{analytics.low_stock_items}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Low Stock Items</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📝</span>
              <span className="text-3xl font-bold text-blue-600">{analytics.today_reservations}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Today's Reservations</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">⏱️</span>
              <span className="text-3xl font-bold text-yellow-600">{analytics.pending_reservations}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Pending Reservations</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'inventory'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inventory Management
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'reservations'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reservations
            </button>
          </div>
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Medicine Inventory</h2>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold">
                + Add Medicine
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Medicine</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Generic</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.inventory_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{item.medicine?.brand}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{item.medicine?.generic}</td>
                      <td className="py-3 px-4 text-gray-900">{item.quantity}</td>
                      <td className="py-3 px-4 text-gray-900">₹{item.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'in_stock' ? 'bg-green-100 text-green-800' :
                          item.status === 'low_stock' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'in_stock' ? 'In Stock' :
                           item.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-primary-600 hover:text-primary-700 mr-3 text-sm font-semibold">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600">No reservations yet</p>
              </div>
            ) : (
              reservations.map((res) => (
                <div key={res.reservation_id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{res.medicine?.brand}</h3>
                      <p className="text-sm text-gray-600">Customer: {res.user?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      res.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      res.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {res.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="text-sm text-gray-600">
                      <p><span className="font-semibold">Quantity:</span> {res.quantity}</p>
                      <p><span className="font-semibold">Pickup Time:</span> {new Date(res.pickup_time).toLocaleString()}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><span className="font-semibold">Contact:</span> {res.user?.phone}</p>
                      <p><span className="font-semibold">Reserved:</span> {new Date(res.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {res.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateReservationStatus(res.reservation_id, 'confirmed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateReservationStatus(res.reservation_id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {res.status === 'confirmed' && (
                    <button
                      onClick={() => updateReservationStatus(res.reservation_id, 'completed')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyDashboard;