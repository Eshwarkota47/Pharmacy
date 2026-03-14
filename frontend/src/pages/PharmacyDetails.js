import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext';

const PharmacyDetails = () => {
  const { pharmacyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showSubstitutes, setShowSubstitutes] = useState(false);
  const [substitutes, setSubstitutes] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [reservationData, setReservationData] = useState({
    quantity: 1,
    pickup_time: '',
    notes: ''
  });

  useEffect(() => {
    fetchPharmacyDetails();
    if (location.state?.selectedMedicine) {
      setSelectedMedicine(location.state.selectedMedicine.medicine);
    }
  }, [pharmacyId]);

  const fetchPharmacyDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pharmacies/${pharmacyId}`);
      const data = await response.json();
      setPharmacy(data.pharmacy);
    } catch (error) {
      console.error('Error fetching pharmacy:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubstitutes = async (medicine) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/medicines/substitute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicine_name: medicine.brand,
          generic_name: medicine.generic,
          composition: medicine.composition,
          dosage: medicine.dosage
        })
      });
      const data = await response.json();
      setSubstitutes(data.substitutes || []);
      setShowSubstitutes(true);
    } catch (error) {
      console.error('Error fetching substitutes:', error);
      setSubstitutes([]);
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          pharmacy_id: pharmacyId,
          medicine_id: selectedMedicine.medicine_id,
          quantity: parseInt(reservationData.quantity),
          pickup_time: reservationData.pickup_time,
          notes: reservationData.notes
        })
      });

      if (response.ok) {
        alert('Reservation successful!');
        setShowReservationModal(false);
        navigate('/reservations');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Reservation failed. Please try again.');
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

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Pharmacy not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="pharmacy-details">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pharmacy Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{pharmacy.name}</h1>
              <p className="text-gray-600">{pharmacy.locality}</p>
            </div>
            <div className="flex gap-3">
              {pharmacy.is_open ? (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                  OPEN
                </span>
              ) : (
                <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold">
                  CLOSED
                </span>
              )}
              {pharmacy.is_24x7 && (
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                  24/7
                </span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex items-center text-gray-700">
                <span className="mr-3 text-xl">📞</span>
                <span className="font-medium">Contact:</span>
                <span className="ml-2">{pharmacy.contact}</span>
              </p>
              <p className="flex items-center text-gray-700">
                <span className="mr-3 text-xl">🕐</span>
                <span className="font-medium">Hours:</span>
                <span className="ml-2">{pharmacy.operating_hours}</span>
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Map Placeholder</p>
              <div className="h-32 bg-gray-300 rounded flex items-center justify-center text-gray-600">
                📍 Map will be integrated here
              </div>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Medicines</h2>
          <div className="grid gap-4">
            {pharmacy.inventory && pharmacy.inventory.length > 0 ? (
              pharmacy.inventory.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{item.medicine.brand}</h3>
                      <p className="text-sm text-gray-600">Generic: {item.medicine.generic}</p>
                      <p className="text-sm text-gray-600">Dosage: {item.medicine.dosage}</p>
                      <p className="text-lg font-bold text-primary-600 mt-2">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'in_stock' ? 'bg-green-100 text-green-800' :
                        item.status === 'low_stock' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'in_stock' ? 'In Stock' :
                         item.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <div className="flex gap-2">
                        {item.status !== 'out_of_stock' && (
                          <button
                            onClick={() => {
                              setSelectedMedicine(item.medicine);
                              setShowReservationModal(true);
                            }}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-semibold"
                            data-testid="reserve-medicine-btn"
                          >
                            Reserve
                          </button>
                        )}
                        <button
                          onClick={() => fetchSubstitutes(item.medicine)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                        >
                          Substitutes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No medicines available</p>
            )}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Reserve Medicine</h3>
            <form onSubmit={handleReservation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine</label>
                <p className="text-lg font-semibold text-gray-900">{selectedMedicine?.brand}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={reservationData.quantity}
                  onChange={(e) => setReservationData({...reservationData, quantity: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                <input
                  type="datetime-local"
                  value={reservationData.pickup_time}
                  onChange={(e) => setReservationData({...reservationData, pickup_time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={reservationData.notes}
                  onChange={(e) => setReservationData({...reservationData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Substitutes Modal */}
      {showSubstitutes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI Substitute Suggestions</h3>
            {substitutes.length > 0 ? (
              <div className="space-y-4">
                {substitutes.map((sub, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{sub.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sub.type === 'same_generic' ? 'bg-green-100 text-green-800' :
                        sub.type === 'similar_composition' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {sub.type === 'same_generic' ? 'Same Generic' :
                         sub.type === 'similar_composition' ? 'Similar Composition' :
                         'Similar Dosage'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Generic: {sub.generic}</p>
                    <p className="text-sm text-gray-700 mt-2">{sub.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No substitutes found for this medicine.</p>
            )}
            <button
              onClick={() => setShowSubstitutes(false)}
              className="w-full mt-6 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDetails;