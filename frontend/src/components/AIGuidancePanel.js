import React from 'react';

/**
 * AIGuidancePanel - A reusable component that displays contextual AI guidance
 * for healthcare staff during medicine-handling tasks
 */
const AIGuidancePanel = ({ 
  type = 'info', // info, warning, urgent, success, recommendation
  icon = '🤖',
  title,
  message,
  recommendations = [],
  nextSteps = [],
  className = '',
  showBorder = true
}) => {
  const typeStyles = {
    info: {
      container: 'bg-blue-50 border-blue-300',
      header: 'bg-blue-100 text-blue-900',
      text: 'text-blue-800',
      badge: 'bg-blue-200 text-blue-900'
    },
    warning: {
      container: 'bg-orange-50 border-orange-300',
      header: 'bg-orange-100 text-orange-900',
      text: 'text-orange-800',
      badge: 'bg-orange-200 text-orange-900'
    },
    urgent: {
      container: 'bg-red-50 border-red-300',
      header: 'bg-red-100 text-red-900',
      text: 'text-red-800',
      badge: 'bg-red-200 text-red-900'
    },
    success: {
      container: 'bg-green-50 border-green-300',
      header: 'bg-green-100 text-green-900',
      text: 'text-green-800',
      badge: 'bg-green-200 text-green-900'
    },
    recommendation: {
      container: 'bg-purple-50 border-purple-300',
      header: 'bg-purple-100 text-purple-900',
      text: 'text-purple-800',
      badge: 'bg-purple-200 text-purple-900'
    }
  };

  const styles = typeStyles[type] || typeStyles.info;
  const borderClass = showBorder ? 'border-2' : '';

  return (
    <div className={`rounded-xl ${borderClass} ${styles.container} ${className}`}>
      {/* Header */}
      <div className={`px-4 py-3 rounded-t-xl ${styles.header} flex items-center space-x-3`}>
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="font-bold text-sm flex items-center">
            <span className={`mr-2 px-2 py-0.5 rounded text-xs font-bold ${styles.badge}`}>
              AI GUIDANCE
            </span>
            {title}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Main Message */}
        {message && (
          <p className={`text-sm font-medium ${styles.text}`}>
            {message}
          </p>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <div className={`text-xs font-bold ${styles.text} mb-2`}>
              💡 AI RECOMMENDATIONS:
            </div>
            <ul className="space-y-1.5">
              {recommendations.map((rec, index) => (
                <li key={index} className={`text-sm ${styles.text} flex items-start`}>
                  <span className="mr-2 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <div>
            <div className={`text-xs font-bold ${styles.text} mb-2`}>
              ⚡ RECOMMENDED NEXT STEPS:
            </div>
            <div className="space-y-2">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full ${styles.badge} flex items-center justify-center text-xs font-bold mr-2`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm ${styles.text} mt-0.5`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Generate contextual AI guidance based on medicine search result
 */
export const generateSearchGuidance = (result, emergencyMode = false) => {
  const { inventory, is_open, distance, pharmacy_name } = result;
  const guidance = [];

  // Urgent mode guidance
  if (emergencyMode) {
    if (inventory.status === 'in_stock' && is_open && distance < 2) {
      guidance.push({
        type: 'urgent',
        icon: '🚨',
        title: 'Optimal Urgent Source Identified',
        message: `This location meets all urgent criteria: currently open, in-stock (${inventory.quantity} units), and ${distance} km away.`,
        nextSteps: [
          'Verify stock availability with pharmacy immediately',
          'Prepare prescription for immediate dispensing',
          'If critical, call ahead to confirm exact shelf location'
        ]
      });
    } else if (inventory.status === 'in_stock' && is_open) {
      guidance.push({
        type: 'warning',
        icon: '⚡',
        title: 'Urgent Alternative Available',
        message: `Stock confirmed at ${pharmacy_name} (${distance} km). Consider if distance is acceptable for urgent case.`,
        recommendations: [
          'This location is currently open and has confirmed stock',
          `Travel time: approximately ${Math.ceil(distance * 3)} minutes`,
          'Consider patient urgency vs. travel time trade-off'
        ]
      });
    } else if (inventory.status === 'low_stock') {
      guidance.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Limited Stock for Urgent Case',
        message: `Only ${inventory.quantity} units available. May not be sufficient for urgent demand.`,
        nextSteps: [
          'Check if quantity meets immediate requirement',
          'Have backup location ready',
          'Consider reserving immediately to prevent stock-out'
        ]
      });
    }
  } else {
    // Standard mode guidance
    if (inventory.status === 'in_stock' && is_open) {
      guidance.push({
        type: 'success',
        icon: '✅',
        title: 'Recommended Dispensing Source',
        message: `${pharmacy_name} is open now with adequate stock (${inventory.quantity} units available).`,
        nextSteps: [
          'Mark for dispensing or reserve for patient',
          'Verify dosage matches prescription',
          'Check patient pickup timeline'
        ]
      });
    } else if (inventory.status === 'in_stock' && !is_open) {
      guidance.push({
        type: 'info',
        icon: '🕐',
        title: 'Stock Available - Currently Closed',
        message: `${pharmacy_name} has ${inventory.quantity} units but is currently closed.`,
        recommendations: [
          'Reserve for next-day pickup',
          'Check pharmacy opening hours and inform patient',
          'Consider alternate open locations if needed immediately'
        ]
      });
    } else if (inventory.status === 'low_stock') {
      guidance.push({
        type: 'warning',
        icon: '📉',
        title: 'Low Stock Detected',
        message: `Limited availability: only ${inventory.quantity} units at ${pharmacy_name}.`,
        recommendations: [
          'Reserve immediately to secure stock',
          'Consider allocating from alternate branch if ordering multiple units',
          'Notify inventory manager for restocking'
        ]
      });
    }
  }

  // Distance-based guidance
  if (distance > 5) {
    guidance.push({
      type: 'info',
      icon: '📍',
      title: 'Distance Consideration',
      message: `This location is ${distance} km away. Check if patient can travel or if delivery is needed.`,
      recommendations: [
        'Verify patient mobility and transportation',
        'Check if pharmacy offers delivery service',
        'Consider closer alternatives if available'
      ]
    });
  }

  return guidance;
};

/**
 * Generate AI guidance when no stock is found
 */
export const generateNoStockGuidance = (query, emergencyMode = false) => {
  if (emergencyMode) {
    return {
      type: 'urgent',
      icon: '🚨',
      title: 'Urgent: No Stock Found',
      message: `No inventory locations currently have "${query}" in stock. Immediate action required.`,
      nextSteps: [
        'Request AI substitute recommendations immediately',
        'Check therapeutic equivalents with same composition',
        'Contact supplier for emergency procurement if critical',
        'Notify prescribing physician about substitution need'
      ]
    };
  }

  return {
    type: 'recommendation',
    icon: '🤖',
    title: 'AI Substitute Assistance Available',
    message: `"${query}" is currently out of stock across all locations.`,
    recommendations: [
      'AI can suggest clinically valid substitutes based on composition and therapeutic use',
      'Check generic equivalents or same-dosage alternatives',
      'Verify substitute with pharmacist before dispensing'
    ],
    nextSteps: [
      'Click "Get AI Substitute Suggestions" below',
      'Review AI-recommended alternatives with clinical reasoning',
      'Confirm substitute availability at nearby pharmacies',
      'Update prescription record with substitution details'
    ]
  };
};

/**
 * Generate workflow assistance for staff dashboard
 */
export const generateWorkflowGuidance = (context) => {
  const { lowStockCount, pendingQueue, timeOfDay } = context;
  const hour = new Date().getHours();
  
  const guidance = [];

  // Time-based guidance
  if (hour >= 8 && hour < 10) {
    guidance.push({
      type: 'info',
      icon: '🌅',
      title: 'Morning Workflow Guidance',
      message: 'Peak morning hours. Prioritize prescription queue and verify low-stock items.',
      recommendations: [
        'Review overnight low-stock alerts',
        'Check frequently-requested morning medications',
        'Prepare for increased patient volume'
      ]
    });
  } else if (hour >= 17 && hour < 19) {
    guidance.push({
      type: 'info',
      icon: '🌆',
      title: 'Evening Workflow Guidance',
      message: 'Evening peak hours. Focus on urgent cases and prepare for closing checklist.',
      recommendations: [
        'Complete pending reservations',
        'Process urgent prescriptions first',
        'Begin stock count for critical medicines'
      ]
    });
  }

  // Queue-based guidance
  if (pendingQueue > 5) {
    guidance.push({
      type: 'warning',
      icon: '📋',
      title: 'High Queue Volume Detected',
      message: `${pendingQueue} prescriptions pending. Consider workflow optimization.`,
      nextSteps: [
        'Enable urgent mode for critical prescriptions',
        'Batch similar medicine lookups together',
        'Alert additional staff if available'
      ]
    });
  }

  // Stock-based guidance
  if (lowStockCount > 3) {
    guidance.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Multiple Low Stock Alerts',
      message: `${lowStockCount} medicines below minimum threshold. Proactive action recommended.`,
      recommendations: [
        'Review low-stock items and prioritize critical medicines',
        'Check alternate branch availability for patient referrals',
        'Notify inventory manager for restocking',
        'Prepare substitute alternatives for anticipated requests'
      ]
    });
  }

  return guidance;
};

export default AIGuidancePanel;
