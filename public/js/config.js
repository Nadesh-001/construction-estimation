// API Configuration for Cloudflare Pages Deployment
// Update this URL after deploying your backend to Render or another service

const API_BASE_URL = 'http://localhost:5000'; // Change this to your deployed backend URL
// Example: const API_BASE_URL = 'https://construction-estimation.onrender.com';

// Make available globally
if (typeof window !== 'undefined') {
    window.API_BASE_URL = API_BASE_URL;
}

// Export for use in other modules (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}
