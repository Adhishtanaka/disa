const config = require('../config');

/**
 * Formats messages for WhatsApp display
 */
const formatMessage = {
    /**
     * Format a success message
     * @param {string} message - The message content
     * @returns {string} Formatted message
     */
    success: (message) => {
        return `✅ *Success*\n\n${message}`;
    },
    
    /**
     * Format an error message
     * @param {string} message - The error message
     * @returns {string} Formatted error message
     */
    error: (message) => {
        return `❌ *Error*\n\n${message}`;
    },
    
    /**
     * Format an information message
     * @param {string} message - The information message
     * @returns {string} Formatted info message
     */
    info: (message) => {
        return `ℹ️ *Information*\n\n${message}`;
    },
    
    /**
     * Format a warning message
     * @param {string} message - The warning message
     * @returns {string} Formatted warning message
     */
    warning: (message) => {
        return `⚠️ *Warning*\n\n${message}`;
    },

    /**
     * Format a question/prompt message
     * @param {string} message - The question message
     * @returns {string} Formatted question message
     */
    question: (message) => {
        return `❓ *${message}*`;
    },
    
    /**
     * Format a help message with all commands
     * @returns {string} Formatted help message
     */
    help: () => {
        return [
            config.MESSAGE_TEMPLATES.WELCOME,
            '',
            ...config.MESSAGE_TEMPLATES.HELP_COMMANDS,
            '',
            config.MESSAGE_TEMPLATES.FOOTER
        ].join('\n');
    },
    
    /**
     * Format a profile information display
     * @param {Object} profile - User profile data
     * @returns {string} Formatted profile information
     */
    profile: (profile) => {
        let lines = [
            '👤 *Your Profile*',
            '',
            `*Name:* ${profile.name || 'Not set'}`,
            `*Email:* ${profile.email || 'Not set'}`,
            `*Phone:* ${profile.phone || 'Not set'}`
        ];
        
        if (profile.role) lines.push(`*Role:* ${formatMessage.capitalize(profile.role)}`);
        if (profile.latitude && profile.longitude) lines.push(`*Location:* Lat ${profile.latitude}, Long ${profile.longitude}`);
        if (profile.skills && profile.skills.length) lines.push(`*Skills:* ${profile.skills.join(', ')}`);
        if (profile.department) lines.push(`*Department:* ${profile.department}`);
        
        return lines.join('\n');
    },
    
    /**
     * Capitalize the first letter of each word
     * @param {string} text - Text to capitalize
     * @returns {string} Capitalized text
     */
    capitalize: (text) => {
        return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }
};

/**
 * Validates user input based on type
 * @param {string} type - Type of data to validate
 * @param {string} input - User input
 * @returns {Object} Validation result
 */
const validateInput = {
    /**
     * Validate an email address
     * @param {string} email - Email to validate
     * @returns {Object} Validation result
     */
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            valid: emailRegex.test(email),
            message: emailRegex.test(email) ? null : 'Please enter a valid email address.'
        };
    },
    
    /**
     * Validate a coordinate (latitude or longitude)
     * @param {string} coord - Coordinate to validate
     * @param {string} type - 'latitude' or 'longitude'
     * @returns {Object} Validation result
     */
    coordinate: (coord, type) => {
        const num = parseFloat(coord);
        let valid = !isNaN(num);
        
        if (valid) {
            if (type === 'latitude') {
                valid = num >= -90 && num <= 90;
            } else if (type === 'longitude') {
                valid = num >= -180 && num <= 180;
            }
        }
        
        return {
            valid,
            value: valid ? num : null,
            message: valid ? null : `Please enter a valid ${type} coordinate.`
        };
    },
    
    /**
     * Validate non-empty text
     * @param {string} text - Text to validate
     * @returns {Object} Validation result
     */
    nonEmpty: (text) => {
        const valid = text && text.trim().length > 0;
        return {
            valid,
            message: valid ? null : 'This field cannot be empty.'
        };
    }
};

module.exports = {
    formatMessage,
    validateInput
};
