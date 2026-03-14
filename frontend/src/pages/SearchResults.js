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
  const [filterOpen, setFilterOpen] = useState(false);

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

  const getStatusBadge = (status) => {
    const badges = {
      in_stock: { bg: 'bg-green-100', text: 'text-green-800', label: 'In Stock' },
      low_stock: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Low Stock' },
      out_of_stock: { bg: 'bg-red-100', text: 'text-red-800', label: 'Out of Stock' },
    };
    const badge = badges[status] || badges.out_of_stock;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const handleReserve = (pharmacy, medicine, inventory) => {
    navigate(`/pharmacy/${pharmacy.pharmacy_id}`, {
      state: { selectedMedicine: { medicine, inventory, pharmacy } }
    });
  };

  if (loading) {
    return (
      <div className=\"min-h-screen bg-gray-50\">
        <Navbar />
        <div className=\"flex items-center justify-center h-96\">
          <div className=\"text-center\">
            <div className=\"animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4\"></div>
            <p className=\"text-gray-600\">Searching for medicines...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-gray-50\" data-testid=\"search-results\">
      <Navbar />
      
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        {/* Header */}
        <div className=\"mb-6\">
          <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">
            Search Results for \"{query}\"
          </h1>
          <p className=\"text-gray-600\">
            Found {results.length} results
            {emergencyMode && <span className=\"ml-2 text-red-600 font-semibold\">🚨 EMERGENCY MODE</span>}
          </p>
        </div>

        {/* Filters & Sort */}
        <div className=\"bg-white rounded-xl shadow-md p-4 mb-6\">
          <div className=\"flex flex-wrap items-center gap-4\">
            <label className=\"font-semibold text-gray-700\">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className=\"px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent\"
              data-testid=\"sort-select\"
            >
              <option value=\"nearest\">Nearest</option>
              <option value=\"open_now\">Open Now</option>
              <option value=\"in_stock\">In Stock</option>
            </select>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className=\"ml-auto px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition\"
            >
              {filterOpen ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {filterOpen && (
            <div className=\"mt-4 pt-4 border-t border-gray-200\">
              <div className=\"grid md:grid-cols-3 gap-4\">
                <label className=\"flex items-center space-x-2\">
                  <input type=\"checkbox\" className=\"rounded\" />
                  <span className=\"text-sm text-gray-700\">Open Now</span>
                </label>
                <label className=\"flex items-center space-x-2\">
                  <input type=\"checkbox\" className=\"rounded\" />
                  <span className=\"text-sm text-gray-700\">24/7 Only</span>
                </label>
                <label className=\"flex items-center space-x-2\">
                  <input type=\"checkbox\" className=\"rounded\" />
                  <span className=\"text-sm text-gray-700\">In Stock Only</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className=\"bg-white rounded-xl shadow-md p-12 text-center\">
            <div className=\"text-6xl mb-4\">😔</div>
            <h3 className=\"text-2xl font-bold text-gray-900 mb-2\">No Results Found</h3>
            <p className=\"text-gray-600 mb-6\">
              We couldn't find any pharmacies with \"{query}\" in stock.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className=\"bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition\"
            >
              Try Another Search
            </button>
          </div>
        ) : (
          <div className=\"space-y-4\">
            {emergencyMode && results.length > 0 && (
              <div className=\"bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl shadow-lg p-6\">
                <div className=\"flex items-center space-x-4\">
                  <span className=\"text-4xl\">🚨</span>
                  <div>
                    <h3 className=\"text-xl font-bold mb-1\">Fastest Reachable Pharmacy</h3>
                    <p className=\"text-red-100\">{results[0].pharmacy_name} - {results[0].distance} km away</p>
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
                <div className=\"flex flex-col md:flex-row md:items-center md:justify-between gap-4\">
                  <div className=\"flex-1\">
                    <div className=\"flex items-center gap-3 mb-3\">
                      <h3 className=\"text-xl font-bold text-gray-900\">
                        {result.pharmacy_name}
                      </h3>
                      {result.is_open ? (
                        <span className=\"px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold\">
                          OPEN
                        </span>
                      ) : (
                        <span className=\"px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold\">
                          CLOSED
                        </span>
                      )}
                      {result.is_24x7 && (
                        <span className=\"px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold\">
                          24/7
                        </span>
                      )}
                    </div>

                    <div className=\"space-y-2 text-sm text-gray-600\">
                      <p className=\"flex items-center\">
                        <span className=\"mr-2\">📍</span>
                        {result.locality} • {result.distance} km away
                      </p>
                      <p className=\"flex items-center\">
                        <span className=\"mr-2\">📞</span>
                        {result.contact}
                      </p>
                      <p className=\"flex items-center\">
                        <span className=\"mr-2\">🕐</span>
                        {result.operating_hours}
                      </p>
                    </div>

                    <div className=\"mt-4 p-4 bg-gray-50 rounded-lg\">
                      <div className=\"flex items-center justify-between mb-2\">
                        <span className=\"font-semibold text-gray-900\">{result.medicine.brand}</span>
                        {getStatusBadge(result.inventory.status)}
                      </div>
                      <div className=\"text-sm text-gray-600\">
                        <p>Generic: {result.medicine.generic}</p>
                        <p>Dosage: {result.medicine.dosage}</p>
                        <p className=\"mt-1\">
                          <span className=\"font-semibold\">Quantity Available:</span> {result.inventory.quantity}
                        </p>
                        <p className=\"text-lg font-bold text-primary-600 mt-2\">
                          ₹{result.inventory.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className=\"flex flex-col gap-3 md:w-48\">
                    <button
                      onClick={() => navigate(`/pharmacy/${result.pharmacy_id}`)}
                      className=\"w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition\"
                      data-testid=\"view-details-btn\"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleReserve(result, result.medicine, result.inventory)}
                      className=\"w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition\"
                      disabled={result.inventory.status === 'out_of_stock'}
                      data-testid=\"reserve-btn\"
                    >
                      Reserve
                    </button>
                    <button
                      className=\"w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition\"
                    >
                      Navigate →
                    </button>
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

export default SearchResults;
