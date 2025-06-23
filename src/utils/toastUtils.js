/**
 * Toast utility functions for showing notifications
 */

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds (default: 1300)
 * @param {string} type - Toast type: 'success', 'error', 'info' (default: 'success')
 */
export function showToast(message, duration = 1300, type = 'success') {
  // Remove any existing toast
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.textContent = message;
  
  // Add to document
  document.body.appendChild(toast);
  
  // Remove after duration
  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, duration);
}

/**
 * Show a success toast
 * @param {string} message - The success message
 */
export function showSuccessToast(message) {
  showToast(message, 1300, 'success');
}

/**
 * Show an error toast
 * @param {string} message - The error message
 */
export function showErrorToast(message) {
  showToast(message, 2000, 'error');
}

/**
 * Show an info toast
 * @param {string} message - The info message
 */
export function showInfoToast(message) {
  showToast(message, 1500, 'info');
}

export default {
  showToast,
  showSuccessToast,
  showErrorToast,
  showInfoToast
};
