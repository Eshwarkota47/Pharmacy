import React, { useState, useEffect, useRef } from 'react';

/**
 * MedicineSearchInput - Autocomplete search component for medicine lookup
 * Supports brand name, generic name, and partial text matching
 */
const MedicineSearchInput = ({ 
  value, 
  onChange, 
  onSelect,
  placeholder = "Search medicine by brand or generic name...",
  className = "",
  disabled = false,
  autoFocus = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mediguide_recent_searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Fetch medicine suggestions
  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/medicines/autocomplete?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setHighlightedIndex(-1);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Show dropdown
    setIsOpen(true);

    // Debounce API call
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelect = (medicine) => {
    onChange(medicine.brand);
    onSelect(medicine);
    setIsOpen(false);
    setHighlightedIndex(-1);

    // Save to recent searches
    const updated = [
      medicine.brand,
      ...recentSearches.filter(s => s !== medicine.brand)
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('mediguide_recent_searches', JSON.stringify(updated));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    const itemCount = suggestions.length || recentSearches.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < itemCount - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : itemCount - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const items = suggestions.length > 0 ? suggestions : 
                       recentSearches.map(name => ({ brand: name, generic: name }));
          if (items[highlightedIndex]) {
            handleSelect(items[highlightedIndex]);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle focus
  const handleFocus = () => {
    if (!value || value.trim().length === 0) {
      // Show recent searches if input is empty
      setIsOpen(recentSearches.length > 0);
    } else {
      setIsOpen(true);
      if (value.trim().length >= 2) {
        fetchSuggestions(value);
      }
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query || query.trim().length === 0) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? 
        <mark key={i} className="bg-yellow-200 font-semibold">{part}</mark> : 
        part
    );
  };

  const showSuggestions = isOpen && (suggestions.length > 0 || loading || (value.trim().length === 0 && recentSearches.length > 0));
  const showNoResults = isOpen && !loading && value.trim().length >= 2 && suggestions.length === 0;

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${className}`}
          autoComplete="off"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto"
        >
          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin inline-block w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
              <span className="ml-2">Searching...</span>
            </div>
          )}

          {/* Recent Searches */}
          {!loading && value.trim().length === 0 && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect({ brand: search, generic: search })}
                  className={`w-full text-left px-4 py-3 hover:bg-primary-50 transition ${
                    highlightedIndex === index ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">{search}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div>
              {value.trim().length >= 2 && (
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                  Suggestions ({suggestions.length})
                </div>
              )}
              {suggestions.map((medicine, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(medicine)}
                  className={`w-full text-left px-4 py-3 hover:bg-primary-50 transition border-b border-gray-100 last:border-b-0 ${
                    highlightedIndex === index ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {highlightMatch(medicine.brand, value)}
                      </div>
                      {medicine.generic && medicine.generic !== medicine.brand && (
                        <div className="text-sm text-gray-600">
                          Generic: {highlightMatch(medicine.generic, value)}
                        </div>
                      )}
                      {medicine.dosage && (
                        <div className="text-xs text-gray-500 mt-1">
                          {medicine.dosage}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {showNoResults && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-6 text-center"
        >
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No medicines found</p>
          <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default MedicineSearchInput;
