/**
 * API Service Module
 * Handles all communication with the Flask backend
 */

// Use API_BASE_URL from config.js (loaded in HTML)
// Fallback to localhost if config not loaded
const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL)
    ? window.API_BASE_URL + '/api'
    : 'http://localhost:5000/api';

class APIService {
    constructor() {
        this.token = localStorage.getItem('auth_token');
    }

    /**
     * Get authorization headers
     */
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Handle API response
     */
    async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'An error occurred');
        }

        return data;
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: this.getHeaders(options.requiresAuth)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==========================================
    // AUTHENTICATION ENDPOINTS
    // ==========================================

    /**
     * Register a new user
     */
    async register(username, email, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });

        if (data.access_token) {
            this.token = data.access_token;
            localStorage.setItem('auth_token', this.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    }

    /**
     * Login user
     */
    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (data.access_token) {
            this.token = data.access_token;
            localStorage.setItem('auth_token', this.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    }

    /**
     * Get user profile
     */
    async getProfile() {
        return await this.request('/auth/profile', {
            method: 'GET',
            requiresAuth: true
        });
    }

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        return await this.request('/auth/change-password', {
            method: 'POST',
            requiresAuth: true,
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            })
        });
    }

    /**
     * Logout user
     */
    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // ==========================================
    // PRICING ENDPOINTS
    // ==========================================

    /**
     * Get all materials
     */
    async getMaterials(quality = null) {
        const queryParam = quality ? `?quality=${quality}` : '';
        return await this.request(`/pricing/materials${queryParam}`, {
            method: 'GET'
        });
    }

    /**
     * Get specific material
     */
    async getMaterial(materialId) {
        return await this.request(`/pricing/materials/${materialId}`, {
            method: 'GET'
        });
    }

    /**
     * Get labor rates
     */
    async getLaborRates() {
        return await this.request('/pricing/labor', {
            method: 'GET'
        });
    }

    /**
     * Get consumption ratios
     */
    async getConsumptionRatios(category = null) {
        const queryParam = category ? `?category=${category}` : '';
        return await this.request(`/pricing/consumption-ratios${queryParam}`, {
            method: 'GET'
        });
    }

    /**
     * Add material (admin only)
     */
    async addMaterial(materialData) {
        return await this.request('/pricing/materials', {
            method: 'POST',
            requiresAuth: true,
            body: JSON.stringify(materialData)
        });
    }

    /**
     * Update material (admin only)
     */
    async updateMaterial(materialId, materialData) {
        return await this.request(`/pricing/materials/${materialId}`, {
            method: 'PUT',
            requiresAuth: true,
            body: JSON.stringify(materialData)
        });
    }

    // ==========================================
    // CALCULATOR ENDPOINTS
    // ==========================================

    /**
     * Calculate construction cost
     */
    async calculateConstructionCost(length, breadth, numFloors, quality) {
        return await this.request('/calculators/construction-cost', {
            method: 'POST',
            body: JSON.stringify({
                length,
                breadth,
                num_floors: numFloors,
                quality
            })
        });
    }

    /**
     * Calculate concrete for slab
     */
    async calculateConcreteSlab(length, breadth, thickness) {
        return await this.request('/calculators/concrete-slab', {
            method: 'POST',
            body: JSON.stringify({
                length,
                breadth,
                thickness
            })
        });
    }

    /**
     * Calculate paint required
     */
    async calculatePaint(area, coats, paintType) {
        return await this.request('/calculators/paint', {
            method: 'POST',
            body: JSON.stringify({
                area,
                coats,
                paint_type: paintType
            })
        });
    }

    /**
     * Calculate bricks required
     */
    async calculateBricks(wallLength, wallHeight, wallThickness, quality) {
        return await this.request('/calculators/bricks', {
            method: 'POST',
            body: JSON.stringify({
                wall_length: wallLength,
                wall_height: wallHeight,
                wall_thickness: wallThickness,
                quality
            })
        });
    }

    // ==========================================
    // ESTIMATE ENDPOINTS
    // ==========================================

    /**
     * Save estimate
     */
    async saveEstimate(estimateData) {
        return await this.request('/estimates', {
            method: 'POST',
            requiresAuth: true,
            body: JSON.stringify(estimateData)
        });
    }

    /**
     * Get all user estimates
     */
    async getEstimates() {
        return await this.request('/estimates', {
            method: 'GET',
            requiresAuth: true
        });
    }

    /**
     * Get specific estimate
     */
    async getEstimate(estimateId) {
        return await this.request(`/estimates/${estimateId}`, {
            method: 'GET',
            requiresAuth: true
        });
    }

    /**
     * Update estimate
     */
    async updateEstimate(estimateId, estimateData) {
        return await this.request(`/estimates/${estimateId}`, {
            method: 'PUT',
            requiresAuth: true,
            body: JSON.stringify(estimateData)
        });
    }

    /**
     * Delete estimate
     */
    async deleteEstimate(estimateId) {
        return await this.request(`/estimates/${estimateId}`, {
            method: 'DELETE',
            requiresAuth: true
        });
    }

    // ==========================================
    // HEALTH CHECK
    // ==========================================

    /**
     * Check API health
     */
    async healthCheck() {
        return await this.request('/health', {
            method: 'GET'
        });
    }
}

// Create global API instance
const api = new APIService();
