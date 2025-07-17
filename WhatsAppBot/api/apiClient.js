const axios = require('axios');
const FormData = require('form-data');
const config = require('../config');

/**
 * Makes requests to the disaster management API
 * 
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} endpoint - API endpoint
 * @param {Object|FormData|null} data - Request data
 * @param {string|null} whatsappId - WhatsApp ID for authentication
 * @param {Map} userTokens - Map of user tokens
 * @returns {Object} Response object with success flag and data or error
 */
async function makeApiRequest(method, endpoint, data = null, whatsappId = null, userTokens = new Map()) {
    const url = `${config.API_BASE_URL}${endpoint}`;
    const headers = {};

    if (whatsappId && userTokens.has(whatsappId)) {
        headers['Authorization'] = `Bearer ${userTokens.get(whatsappId)}`;
    }

    try {
        const config = { method, url, headers };
        
        if (data instanceof FormData) {
            // FormData handles its own Content-Type header
            config.headers = { ...headers, ...data.getHeaders() };
            config.data = data;
        } else if (data) {
            config.headers['Content-Type'] = 'application/json';
            config.data = data;
        }

        const response = await axios(config);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`API Request Error to ${endpoint}:`, 
            error.response ? JSON.stringify(error.response.data) : error.message);
        
        let errorMessage = 'An unknown API error occurred.';
        if (error.response && error.response.data) {
            errorMessage = error.response.data.detail || 
                (typeof error.response.data === 'object' ? 
                    JSON.stringify(error.response.data) : 
                    error.response.data);
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        return { 
            success: false, 
            error: errorMessage,
            status: error.response ? error.response.status : 500
        };
    }
}

module.exports = {
    makeApiRequest
};
