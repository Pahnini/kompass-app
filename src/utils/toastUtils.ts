/**
 * Toast utility functions for showing notifications
 */

export type ToastType = "success" | "error" | "info";

/**
 * Show a toast notification
 * @param message - The message to display
 * @param duration - Duration in milliseconds (default: 1300)
 * @param type - Toast type: 'success', 'error', 'info' (default: 'success')
 */
export function showToast(
  message: string,
  duration: number = 1300,
  type: ToastType = "success"
): void {
  // Remove any existing toast
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement("div");
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
 * @param message - The success message
 */
export function showSuccessToast(message: string): void {
  showToast(message, 1300, "success");
}

/**
 * Show an error toast
 * @param message - The error message
 */
export function showErrorToast(message: string): void {
  showToast(message, 2000, "error");
}

/**
 * Show an info toast
 * @param message - The info message
 */
export function showInfoToast(message: string): void {
  showToast(message, 1500, "info");
}

export default {
  showToast,
  showSuccessToast,
  showErrorToast,
  showInfoToast,
};
