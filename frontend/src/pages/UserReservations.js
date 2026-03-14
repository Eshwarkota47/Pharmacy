import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext';
import { FulfillmentStatusBadge } from '../components/StatusBadges';

const FulfillmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, in_progress, completed, cancelled
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [fulfillmentDetails, setFulfillmentDetails] = useState({
    fulfilled_by: '',
    notes: ''
  });
  const [actionLoading, setActionLoading] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/reservations?user_id=${user.user_id}`
      );
      const data = await response.json();
      setRequests(data.reservations || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus, details = {}) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/reservations/${requestId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
            ...details
          }),
        }
      );

      if (response.ok) {
        // Update local state
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.reservation_id === requestId
              ? { ...req, status: newStatus, ...details }
              : req
          )
        );
        showToast(`Request marked as ${newStatus}`, 'success');
      } else {
        showToast('Failed to update request status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error updating request', 'error');
    } finally {
      setActionLoading(null);
      setShowFulfillModal(false);
      setSelectedRequest(null);
    }
  };

  const handleMarkInProgress = (request) => {
    updateRequestStatus(request.reservation_id, 'in_progress');
  };

  const handleMarkFulfilled = (request) => {
    setSelectedRequest(request);
    setShowFulfillModal(true);
  };

  const handleCancelRequest = (request) => {
    if (window.confirm('Are you sure you want to cancel this fulfillment request?')) {
      updateRequestStatus(request.reservation_id, 'cancelled');
    }
  };

  const handleSubmitFulfillment = () => {
    updateRequestStatus(
      selectedRequest.reservation_id,
      'completed',
      {
        fulfilled_by: fulfillmentDetails.fulfilled_by || user.name,
        notes: fulfillmentDetails.notes
      }
    );
  };

  const showToast = (message, type) => {
    // Create a temporary toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white px-6 py-4 rounded-lg shadow-lg`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  // Filter and sort requests
  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Calculate summary stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length
  };

  // Get action buttons based on status
  const getActionButtons = (request) => {
    const isLoading = actionLoading === request.reservation_id;

    switch (request.status) {
      case 'pending':
        return (
          <>
            <button
              onClick={() => handleMarkInProgress(request)}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              {isLoading ? '...' : '▶ Mark In Progress'}
            </button>
            <button
              onClick={() => handleMarkFulfilled(request)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm"
            >
              {isLoading ? '...' : '✓ Mark Fulfilled'}
            </button>
            <button
              onClick={() => handleCancelRequest(request)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 text-sm"
            >
              {isLoading ? '...' : '✗ Cancel'}
            </button>
          </>
        );
      case 'in_progress':
        return (
          <>
            <button
              onClick={() => handleMarkFulfilled(request)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm"
            >
              {isLoading ? '...' : '✓ Mark Fulfilled'}
            </button>
            <button
              onClick={() => handleCancelRequest(request)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 text-sm"
            >
              {isLoading ? '...' : '✗ Cancel'}
            </button>
          </>
        );
      case 'completed':
        return (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm border-2 border-green-300">
            ✓ Fulfilled
          </div>
        );
      case 'cancelled':
        return (
          <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold text-sm border-2 border-red-300">
            ✗ Cancelled
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fulfillment Requests</h1>
          <p className="text-gray-600">Manage medicine hold requests and dispense queue</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600 font-medium">Total Requests</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-400">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 font-medium">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-400">
            <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
            <div className="text-sm text-gray-600 font-medium">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-400">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600 font-medium">Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-400">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600 font-medium">Cancelled</div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">Filter:</span>
              {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
            <div className="border-l border-gray-300 h-8"></div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">Sort:</span>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  sortBy === 'newest'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => setSortBy('oldest')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  sortBy === 'oldest'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Oldest First
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 font-medium">Loading fulfillment requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedRequests.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No Active Requests' : `No ${filter.replace('_', ' ')} Requests`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No medicine fulfillment requests currently in queue.'
                : `No requests with status: ${filter.replace('_', ' ')}`}
            </p>
          </div>
        )}

        {/* Requests List */}
        {!loading && sortedRequests.length > 0 && (
          <div className="space-y-4">
            {sortedRequests.map(request => (
              <div
                key={request.reservation_id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {request.medicine?.brand || 'Medicine'}
                      </h3>
                      <FulfillmentStatusBadge status={request.status} />
                    </div>
                    <p className="text-sm text-gray-600">
                      Request ID: {request.reservation_id}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Source:</span> {request.pharmacy?.name || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Location:</span> {request.pharmacy?.locality || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Contact:</span> {request.pharmacy?.contact || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Quantity Requested:</span> {request.quantity}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Fulfillment Time:</span>{' '}
                      {new Date(request.pickup_time).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Request Created:</span>{' '}
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                    {request.notes && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Staff Notes:</span> {request.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  {getActionButtons(request)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fulfillment Modal */}
        {showFulfillModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mark as Fulfilled</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Medicine:</span> {selectedRequest.medicine?.brand}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Quantity:</span> {selectedRequest.quantity}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fulfilled By (Optional)
                  </label>
                  <input
                    type="text"
                    value={fulfillmentDetails.fulfilled_by}
                    onChange={(e) =>
                      setFulfillmentDetails({ ...fulfillmentDetails, fulfilled_by: e.target.value })
                    }
                    placeholder={user.name}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fulfillment Notes (Optional)
                  </label>
                  <textarea
                    value={fulfillmentDetails.notes}
                    onChange={(e) =>
                      setFulfillmentDetails({ ...fulfillmentDetails, notes: e.target.value })
                    }
                    placeholder="Add any notes about the fulfillment..."
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowFulfillModal(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFulfillment}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : '✓ Confirm Fulfillment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FulfillmentRequests;
