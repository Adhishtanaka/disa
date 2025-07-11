const { formatMessage, validateInput } = require('../utils/messageFormatter');
const { makeApiRequest } = require('../api/apiClient');
const { extractLocationFromMessage } = require('../utils/locationHelper');

const handleLogin = {
    /**
     * Start the login flow
     */
    startFlow: async (msg, senderId, userStates) => {
        userStates.set(senderId, { command: 'login', step: 1, data: {} });
        msg.reply(formatMessage.question('Please enter your username/email to log in:'));
    },
    
    /**
     * Continue the login flow based on current step
     */
    continueFlow: async (msg, senderId, text, currentState, userTokens, userStates) => {
        const data = currentState.data;

        switch (currentState.step) {
            case 1: // Awaiting username
                if (!validateInput.nonEmpty(text).valid) {
                    msg.reply(formatMessage.error('Username/email cannot be empty.'));
                    return;
                }
                
                data.username = text;
                currentState.step = 2;
                msg.reply(formatMessage.question('Please enter your password:'));
                break;
                
            case 2: // Awaiting password
                if (!validateInput.nonEmpty(text).valid) {
                    msg.reply(formatMessage.error('Password cannot be empty.'));
                    return;
                }
                
                data.password = text;
                currentState.step = 3;
                msg.reply(formatMessage.question('Please share your current location using WhatsApp\'s location sharing feature, or reply with your latitude (e.g., 34.0522).'));
                break;
                
            case 3: // Awaiting location or latitude
                // Check if this is a location message
                if (msg.type === 'location' || msg.hasMedia && msg.type === 'image' && msg._data && msg._data.isViewOnce) {
                    try {
                        const location = await extractLocationFromMessage(msg);
                        if (location) {
                            data.latitude = location.latitude;
                            data.longitude = location.longitude;
                            
                            // Proceed to login attempt with the extracted location
                            await attemptLogin(msg, data, senderId, userTokens, userStates);
                            return;
                        }
                    } catch (error) {
                        console.error('Error extracting location:', error);
                        msg.reply(formatMessage.error('Failed to process location. Please try again or enter coordinates manually.'));
                        return;
                    }
                }
                
                // If not a location message, proceed with manual latitude input
                const latValidation = validateInput.coordinate(text, 'latitude');
                if (!latValidation.valid) {
                    msg.reply(formatMessage.error(latValidation.message));
                    return;
                }
                
                data.latitude = latValidation.value;
                currentState.step = 4;
                msg.reply(formatMessage.question('And your current longitude (e.g., -118.2437).'));
                break;
                
            case 4: // Awaiting longitude
                const longValidation = validateInput.coordinate(text, 'longitude');
                if (!longValidation.valid) {
                    msg.reply(formatMessage.error(longValidation.message));
                    return;
                }
                
                data.longitude = longValidation.value;
                await attemptLogin(msg, data, senderId, userTokens, userStates);
                break;
        }
    }
};

// Helper function to attempt login
async function attemptLogin(msg, data, senderId, userTokens, userStates) {
    // Attempt login
    msg.reply(formatMessage.info('Attempting to log you in...'));
    
    // Add your login API request here
        const response = await makeApiRequest(
            'POST',
            '/auth/login',
            {
                email: data.username, // API expects email instead of username
                password: data.password,
                latitude: data.latitude,
                longitude: data.longitude
            },
            null,
            userTokens
        );
    
    if (response.success) {
        // userTokens.set(senderId, response.data.token);
        userTokens.set(senderId, response.data.access_token);
                    
        const userName = response.data.user_info && response.data.user_info.name 
            ? response.data.user_info.name 
            : 'there';
        msg.reply(formatMessage.success(`Login successful! You are now authenticated as ${userName}.`));
    } else {
        msg.reply(formatMessage.error(`Login failed. Please check your credentials and try again.`));
    }
    
    userStates.delete(senderId); // Clear state after login attempt
}

module.exports = {
    handleLogin
};
