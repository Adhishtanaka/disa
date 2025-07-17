const { formatMessage, validateInput } = require('../utils/messageFormatter');
const { makeApiRequest } = require('../api/apiClient');

const handleNearbyDisasters = {
    /**
     * Start the nearby disasters check flow
     */
    startFlow: async (msg, senderId, userStates) => {
        userStates.set(senderId, { command: 'nearby_disasters', step: 1, data: {} });
        msg.reply(formatMessage.question('Please share your latitude (e.g., 34.0522).'));
    },
    
    /**
     * Continue the nearby disasters flow based on current step
     */
    continueFlow: async (msg, senderId, text, currentState, userTokens, userStates) => {
        const data = currentState.data;

        switch (currentState.step) {
            case 1: // Awaiting latitude
                const latValidation = validateInput.coordinate(text, 'latitude');
                if (!latValidation.valid) {
                    msg.reply(formatMessage.error(latValidation.message));
                    return;
                }
                
                data.latitude = latValidation.value;
                currentState.step = 2;
                msg.reply(formatMessage.question('Now, please provide your longitude.'));
                break;
                
            case 2: // Awaiting longitude
                const longValidation = validateInput.coordinate(text, 'longitude');
                if (!longValidation.valid) {
                    msg.reply(formatMessage.error(longValidation.message));
                    return;
                }
                
                data.longitude = longValidation.value;

                // Attempt to check for nearby disasters
                msg.reply(formatMessage.info('Checking for nearby disasters...'));
                
                const response = await makeApiRequest(
                    'GET', 
                    `/public/nearby?latitude=${data.latitude}&longitude=${data.longitude}`,
                    null,
                    null,
                    userTokens
                );

                if (response.success) {
                    // Format nearby disasters data if available
                    if (response.data && response.data.disasters && response.data.disasters.length > 0) {
                        let disastersMessage = '🚨 *Nearby Disasters*\n\n';
                        
                        response.data.disasters.forEach((disaster, index) => {
                            disastersMessage += `*${index + 1}. ${disaster.type || 'Disaster'}*\n`;
                            disastersMessage += `• Status: ${disaster.status || 'Active'}\n`;
                            if (disaster.distance) {
                                disastersMessage += `• Distance: ${disaster.distance.toFixed(1)} km away\n`;
                            }
                            if (disaster.description) {
                                disastersMessage += `• Info: ${disaster.description}\n`;
                            }
                            disastersMessage += '\n';
                        });
                        
                        disastersMessage += '⚠️ Please take appropriate precautions and follow any evacuation orders.';
                        msg.reply(disastersMessage);
                    } else {
                        msg.reply(formatMessage.success('Good news! No active disasters were found near your location.'));
                    }
                } else {
                    msg.reply(formatMessage.error(`Failed to check for nearby disasters: ${response.error}`));
                }
                userStates.delete(senderId); // Clear state after check
                break;
        }
    }
};

module.exports = {
    handleNearbyDisasters
};
