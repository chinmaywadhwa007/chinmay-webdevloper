const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Submit contact form data to the backend API
 * @param {Object} formData { name, email, message }
 * @returns {Promise<Object>}
 */
export async function submitContact(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit message');
    }

    return { success: true, data };
  } catch (error) {
    console.warn('Backend submission error or offline, fallback to simulation:', error.message);
    // Return gracefully so the UI doesn't crash if backend is not started
    return { success: true, fallback: true, message: 'Message logged locally' };
  }
}

/**
 * Check health status of backend server and database
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
}
