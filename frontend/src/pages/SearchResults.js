import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query') || '';
  const emergencyMode = searchParams.get('emergency') === 'true';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(emergencyMode ? 'emergency' : 'nearest');
  const [viewMode, setViewMode] = useState('detailed'); // detailed or compact

  // Mock user location (Delhi center)
  const userLocation = { lat: 28.6139, lng: 77.2090 };

  useEffect(() => {
    fetchResults();
  }, [query, sortBy, emergencyMode]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/medicines/search?query=${encodeURIComponent(query)}&lat=${userLocation.lat}&lng=${userLocation.lng}&emergency_mode=${emergencyMode}&sort_by=${sortBy}`;
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatusBadge = (status, quantity) => {
    const badges = {
      in_stock: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'IN STOCK' },
      low_stock: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', label: 'LOW STOCK' },
      out_of_stock: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'OUT OF STOCK' },
    };
    const badge = badges[status] || badges.out_of_stock;
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${badge.bg} ${badge.text} ${badge.border}`}>
        <span className="font-bold text-xs">{badge.label}</span>
        {status !== 'out_of_stock' && <span className="text-xs">({quantity} units)</span>}
      </div>
    );
  };

  const getUrgencySuitability = (result) => {
    if (result.is_open && result.inventory.status === 'in_stock' && result.distance < 2) {
      return { level: 'HIGH', color: 'green', icon: '✓✓' };
    } else if (result.is_open && result.inventory.status !== 'out_of_stock') {
      return { level: 'MEDIUM', color: 'blue', icon: '✓' };
    } else {
      return { level: 'LOW', color: 'gray', icon: '—' };
    }
  };

  const handleMarkForDispense = (result) => {
    // In real implementation, this would add to active dispense queue
    alert(`Marked: ${result.medicine.brand} from ${result.pharmacy_name}`);
  };

  const handleReserveForPatient = (result) => {
    navigate(`/pharmacy/${result.pharmacy_id}`, {
      state: { selectedMedicine: { medicine: result.medicine, inventory: result.inventory, pharmacy: result } }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Running medicine lookup...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="search-results">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Medicine Lookup: <span className="text-primary-600">"{query}"</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {results.length} stock location{results.length !== 1 ? 's' : ''} found
                {emergencyMode && <span className="ml-2 text-red-600 font-bold">🚨 URGENT PRIORITY MODE</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                {viewMode === 'detailed' ? '📋 Compact View' : '📊 Detailed View'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="font-semibold text-gray-700 text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                data-testid="sort-select"
              >
                <option value="nearest">Nearest Location</option>
                <option value="open_now">Currently Open</option>
                <option value="in_stock">Highest Stock</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-600">Quick Filters:</span>
              <button className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-semibold border border-green-200 hover:bg-green-100">
                In Stock Only
              </button>
              <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 hover:bg-blue-100">
                Open Now
              </button>
              <button className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200 hover:bg-purple-100">
                24/7 Locations
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stock Found</h3>
            <p className="text-gray-600 mb-6">
              No inventory locations currently have "{query}" in stock.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition mr-3"
              >
                Try Another Lookup
              </button>
              <button
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                🤖 Get AI Substitute Suggestions
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {emergencyMode && results.length > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4">
                  <span className="text-5xl">🚨</span>
                  <div>
                    <h3 className="text-xl font-bold mb-1">URGENT: Fastest Available Location</h3>
                    <p className="text-red-100">
                      {results[0].pharmacy_name} • {results[0].distance} km away • 
                      {results[0].is_open ? ' CURRENTLY OPEN' : ' CLOSED'} • 
                      {results[0].inventory.quantity} units available
                    </p>
                  </div>
                </div>
              </div>
            )}

            {results.map((result, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 ${
                  emergencyMode && index === 0 ? 'ring-2 ring-red-500' : ''
                }`}
                data-testid={`pharmacy-result-${index}`}
              >
                {viewMode === 'detailed' ? (
                  /* Detailed View */
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {result.pharmacy_name}
                          </h3>
                          {result.is_open ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-300">
                              OPEN NOW
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold border border-gray-300">
                              CLOSED
                            </span>
                          )}
                          {result.is_24x7 && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-300">
                              24/7
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center">
                            <span className="mr-2">📍</span>
                            <span className="font-semibold">Location:</span>
                            <span className="ml-2">{result.locality} • {result.distance} km away</span>
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">📞</span>
                            <span className="font-semibold">Contact:</span>
                            <span className="ml-2">{result.contact}</span>
                          </p>
                          <p className="flex items-center">
                            <span className="mr-2">🕐</span>
                            <span className="font-semibold">Hours:</span>
                            <span className="ml-2">{result.operating_hours}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStockStatusBadge(result.inventory.status, result.inventory.quantity)}
                        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          getUrgencySuitability(result).color === 'green' ? 'bg-green-100 text-green-800 border border-green-300' :
                          getUrgencySuitability(result).color === 'blue' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}>
                          {getUrgencySuitability(result).icon} URGENCY: {getUrgencySuitability(result).level}
                        </div>
                      </div>
                    </div>

                    {/* Medicine Details Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 font-semibold mb-1">MEDICINE DETAILS</div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Brand Name:</span>
                                <div className="text-base font-bold text-gray-900">{result.medicine.brand}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Generic Name:</span>
                                <div className="text-sm text-gray-800">{result.medicine.generic}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Dosage:</span>
                                <div className="text-sm text-gray-800">{result.medicine.dosage}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Composition:</span>
                                <div className="text-sm text-gray-800">{result.medicine.composition}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Category:</span>
                                <div className="text-sm text-gray-800">{result.medicine.category}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 font-semibold mb-1">STOCK INFORMATION</div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Available Quantity:</span>
                                <div className="text-2xl font-bold text-primary-600">{result.inventory.quantity} units</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Price per Unit:</span>
                                <div className="text-lg font-bold text-gray-900">₹{result.inventory.price}</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Stock Status:</span>
                                <div className="text-sm font-semibold text-gray-800">
                                  {result.inventory.status === 'in_stock' ? 'Adequate Stock' :
                                   result.inventory.status === 'low_stock' ? 'Limited Availability' : 'Currently Unavailable'}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600 font-semibold">Source Pharmacy:</span>
                                <div className="text-sm text-gray-800">{result.pharmacy_name}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Internal Notes Section */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="text-xs text-yellow-800 font-semibold mb-1">📝 INTERNAL HANDLING NOTES</div>
                      <input
                        type="text"
                        placeholder="Add dispensing notes or special handling instructions..."
                        className="w-full px-3 py-2 bg-white border border-yellow-300 rounded text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleMarkForDispense(result)}
                        className="flex-1 min-w-[140px] px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition shadow-sm"
                        disabled={result.inventory.status === 'out_of_stock'}
                      >
                        ✓ Mark for Dispense
                      </button>
                      <button
                        onClick={() => handleReserveForPatient(result)}
                        className="flex-1 min-w-[140px] px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-sm"
                        disabled={result.inventory.status === 'out_of_stock'}
                        data-testid="reserve-btn"
                      >
                        📋 Reserve for Patient
                      </button>
                      <button
                        onClick={() => navigate(`/pharmacy/${result.pharmacy_id}`)}
                        className="flex-1 min-w-[140px] px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
                        data-testid="view-details-btn"
                      >
                        🏥 View Stock Source
                      </button>
                      <button
                        className="flex-1 min-w-[140px] px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-sm"
                      >
                        🤖 View Substitutes
                      </button>
                      <button
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                      >
                        ℹ️ Verify Details
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Compact View */
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                      <div>
                        <div className="font-bold text-gray-900">{result.pharmacy_name}</div>
                        <div className="text-xs text-gray-600">{result.distance} km • {result.is_open ? 'Open' : 'Closed'}</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{result.medicine.brand}</div>
                        <div className="text-xs text-gray-600">{result.medicine.generic}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Stock</div>
                        <div className="text-sm font-bold text-gray-900">{result.inventory.quantity} units</div>
                      </div>
                      <div>
                        {getStockStatusBadge(result.inventory.status, result.inventory.quantity)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMarkForDispense(result)}
                          className="px-3 py-2 bg-primary-600 text-white rounded text-xs font-semibold hover:bg-primary-700"
                        >
                          Dispense
                        </button>
                        <button
                          onClick={() => navigate(`/pharmacy/${result.pharmacy_id}`)}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        {results.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Need Help with Substitutes?</h3>
                <p className="text-sm text-gray-600">Get AI-powered alternative recommendations if medicine is unavailable</p>
              </div>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                🤖 Get AI Substitute Guidance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
