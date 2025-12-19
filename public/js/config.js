// API Configuration
// Automatically detects environment and uses appropriate API URL

// Determine API base URL based on environment
const API_BASE_URL = (() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:5000';
        }

        // Production (Vercel or any other deployment)
        // Use same origin since Vercel serves both frontend and backend
        return window.location.origin;
    }

    // Fallback for non-browser environments
    return 'http://localhost:5000';
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.API_BASE_URL = API_BASE_URL;
    console.log('API Base URL:', API_BASE_URL);
}

// Export for use in other modules (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}
