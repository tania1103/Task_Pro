/**
 * Helper functions for card data transformation and validation
 */

/**
 * Maps frontend priority values to backend expected format
 * @param {string} priority - Frontend priority value
 * @returns {string} - Backend compatible priority value
 */
export const mapPriorityToBackend = (priority) => {
  switch(priority) {
    case 'without priority': return 'low';
    case 'low': return 'low';
    case 'medium': return 'medium';
    case 'high': return 'high';
    default: return 'low';
  }
};

/**
 * Maps backend priority values to frontend expected format
 * @param {string} priority - Backend priority value
 * @returns {string} - Frontend compatible priority value
 */
export const mapPriorityToFrontend = (priority) => {
  if (!priority) return 'without priority';
  return priority;
};

/**
 * Formats card data for API requests
 * @param {Object} cardInfo - Card data from frontend
 * @returns {Object} - Formatted card data for backend
 */
export const formatCardForApi = (cardInfo) => {
  return {
    title: cardInfo.title,
    description: cardInfo.description,
    priority: mapPriorityToBackend(cardInfo.priority),
    dueDate: cardInfo.deadline,
    column: cardInfo.column,
  };
};

/**
 * Validates card data before API submission
 * @param {Object} cardInfo - Card data to validate
 * @returns {Object} - { isValid: boolean, error: string|null }
 */
export const validateCardData = (cardInfo) => {
  if (!cardInfo.title || !cardInfo.title.trim()) {
    return { isValid: false, error: 'Title is required' };
  }

  if (!cardInfo.description || !cardInfo.description.trim()) {
    return { isValid: false, error: 'Description is required' };
  }

  if (!cardInfo.column) {
    return { isValid: false, error: 'Column is required' };
  }

  return { isValid: true, error: null };
};