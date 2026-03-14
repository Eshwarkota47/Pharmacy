import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext';

const UserReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/reservations?user_id=${user.user_id}`);
      const data = await response.json();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
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
    <div className="min-h-screen bg-gray-50" data-testid="user-reservations">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reservations</h1>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reservations Yet</h3>
            <p className="text-gray-600">You haven't made any medicine reservations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div key={reservation.reservation_id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {reservation.medicine?.brand || 'Medicine'}
                  </h3>
                  {getStatusBadge(reservation.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Pharmacy:</span> {reservation.pharmacy?.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Location:</span> {reservation.pharmacy?.locality}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Contact:</span> {reservation.pharmacy?.contact}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Quantity:</span> {reservation.quantity}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Pickup Time:</span> {new Date(reservation.pickup_time).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Reserved On:</span> {new Date(reservation.created_at).toLocaleDateString()}
                    </p>
                    {reservation.notes && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Notes:</span> {reservation.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReservations;