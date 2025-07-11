const { formatMessage, validateInput } = require('../utils/messageFormatter');
const { makeApiRequest } = require('../api/apiClient');

const handleLogin = {
    /**
     * Start the login flow
     */
    startFlow: async (msg, senderId, userStates) => {
        userStates.set(senderId, { command: 'login', step: 1, data: {} });
        msg.reply(formatMessage.question('What is your email address?'));
    },
    
    /**
     * Continue the login flow based on current step
     */
    continueFlow: async (msg, senderId, text, currentState, userTokens, userStates) => {
        const data = currentState.data;

        switch (currentState.step) {
            case 1: // Awaiting email
                const emailValidation = validateInput.email(text);
                if (!emailValidation.valid) {
                    msg.reply(formatMessage.error(emailValidation.message));
                    return;
                }
                
                data.email = text;
                currentState.step = 2;
                msg.reply(formatMessage.question('What is your password?'));
                break;
                
            case 2: // Awaiting password
                if (!validateInput.nonEmpty(text).valid) {
                    msg.reply(formatMessage.error('Password cannot be empty.'));
                    return;
                }
                
                data.password = text;
                currentState.step = 3;
                msg.reply(formatMessage.question('Please provide your current latitude (e.g., 34.0522).'));
                break;
                
            case 3: // Awaiting latitude
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

                // Attempt login
                msg.reply(formatMessage.info('Attempting to log you in...'));
                
                const response = await makeApiRequest('POST', '/auth/login', {
                    email: data.email,
                    password: data.password,
                    latitude: data.latitude,
                    longitude: data.longitude,
                }, null, userTokens);

                if (response.success) {
                    userTokens.set(senderId, response.data.access_token);
                    
                    const userName = response.data.user_info && response.data.user_info.name 
                        ? response.data.user_info.name 
                        : 'there';
                        
                    msg.reply(formatMessage.success(`Login successful! Welcome, ${userName}!`));
                } else {
                    msg.reply(formatMessage.error(`Login failed: ${response.error}`));
                }
                userStates.delete(senderId); // Clear state after login attempt
                break;
        }
    }
};

module.exports = {
    handleLogin
};
