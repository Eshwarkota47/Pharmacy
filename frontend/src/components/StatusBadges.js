import React from 'react';

/**
 * Status Badge Components for Medicine and Source Availability
 */

// Stock Status Badge
export const StockBadge = ({ status, quantity }) => {
  const getConfig = () => {
    switch (status) {
      case 'in_stock':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '✓',
          label: 'In Stock',
          border: 'border-green-300'
        };
      case 'low_stock':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: '⚠️',
          label: 'Low Stock',
          border: 'border-orange-300'
        };
      case 'out_of_stock':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '✗',
          label: 'Out of Stock',
          border: 'border-red-300'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '?',
          label: 'Unknown',
          border: 'border-gray-300'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} border-2 ${config.border} font-semibold text-sm`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
      {quantity !== undefined && quantity !== null && (
        <span className="ml-1">({quantity} units)</span>
      )}
    </div>
  );
};

// Source Operational Status Badge
export const SourceStatusBadge = ({ isOpen, className = "" }) => {
  return isOpen ? (
    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-green-100 text-green-800 border-2 border-green-300 font-semibold text-sm ${className}`}>
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      <span>OPERATIONAL</span>
    </div>
  ) : (
    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 font-semibold text-sm ${className}`}>
      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
      <span>CLOSED</span>
    </div>
  );
};

// Urgency Readiness Badge
export const UrgencyBadge = ({ level }) => {
  const getConfig = () => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
      case 'OPTIMAL':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '🚨',
          label: 'URGENT READY',
          border: 'border-red-400'
        };
      case 'MEDIUM':
      case 'SUITABLE':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: '⚡',
          label: 'PRIORITY',
          border: 'border-yellow-400'
        };
      case 'LOW':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: 'ℹ️',
          label: 'STANDARD',
          border: 'border-blue-300'
        };
      default:
        return null;
    }
  };

  const config = getConfig();
  if (!config) return null;

  return (
    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full ${config.bg} ${config.text} border-2 ${config.border} font-bold text-xs`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};

// Substitute Available Badge
export const SubstituteBadge = ({ available = false }) => {
  if (!available) return null;

  return (
    <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 border-2 border-purple-300 font-semibold text-sm">
      <span>🤖</span>
      <span>Substitute Available</span>
    </div>
  );
};

// Distance Badge
export const DistanceBadge = ({ distance }) => {
  if (!distance) return null;

  const getColor = () => {
    if (distance < 2) return 'bg-green-50 text-green-700 border-green-200';
    if (distance < 5) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-orange-50 text-orange-700 border-orange-200';
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full border-2 font-semibold text-sm ${getColor()}`}>
      <span>📍</span>
      <span>{distance} km</span>
    </div>
  );
};

// Fulfillment Status Badge (for reservations/requests)
export const FulfillmentStatusBadge = ({ status }) => {
  const getConfig = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: '⏱️',
          label: 'PENDING',
          border: 'border-yellow-300'
        };
      case 'confirmed':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: '✓',
          label: 'CONFIRMED',
          border: 'border-blue-300'
        };
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '✓✓',
          label: 'COMPLETED',
          border: 'border-green-300'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '✗',
          label: 'CANCELLED',
          border: 'border-red-300'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '?',
          label: status?.toUpperCase() || 'UNKNOWN',
          border: 'border-gray-300'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full ${config.bg} ${config.text} border-2 ${config.border} font-bold text-xs`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};

// Medicine Info Card Component
export const MedicineInfoCard = ({ medicine, className = "" }) => {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="space-y-2">
        <div>
          <div className="text-xs font-bold text-blue-900 mb-1">MEDICINE DETAILS</div>
          <div className="text-lg font-bold text-gray-900">{medicine.brand || medicine.name}</div>
        </div>
        
        {medicine.generic && medicine.generic !== medicine.brand && (
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Generic:</span> {medicine.generic}
          </div>
        )}
        
        {medicine.dosage && (
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Dosage:</span> {medicine.dosage}
          </div>
        )}
        
        {medicine.composition && (
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Composition:</span> {medicine.composition}
          </div>
        )}
      </div>
    </div>
  );
};

// Source Info Card Component
export const SourceInfoCard = ({ source, className = "" }) => {
  return (
    <div className={`bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs font-bold text-green-900 mb-1">SOURCE DETAILS</div>
            <div className="text-lg font-bold text-gray-900">{source.name || source.pharmacy_name}</div>
          </div>
          <SourceStatusBadge isOpen={source.is_open !== undefined ? source.is_open : true} />
        </div>
        
        {source.locality && (
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Location:</span> {source.locality}
          </div>
        )}
        
        {source.contact && (
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Contact:</span> {source.contact}
          </div>
        )}
        
        {source.timings && (
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Hours:</span> {source.timings}
          </div>
        )}
        
        {source.distance !== undefined && (
          <div className="mt-2">
            <DistanceBadge distance={source.distance} />
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  StockBadge,
  SourceStatusBadge,
  UrgencyBadge,
  SubstituteBadge,
  DistanceBadge,
  FulfillmentStatusBadge,
  MedicineInfoCard,
  SourceInfoCard
};
