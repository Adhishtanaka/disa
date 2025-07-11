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
                    // console.log("API Response:", JSON.stringify(response.data, null, 2));
                    
                    // Filter for only active disasters
                    // Check if response.data is an array directly or nested inside an object
                    const disastersArray = Array.isArray(response.data) ? response.data : 
                                         (response.data && response.data.disasters ? response.data.disasters : []);
                    const activeDisasters = disastersArray.filter(disaster => disaster.status === 'active');
                    
                    // console.log("Active disasters:", activeDisasters.length, JSON.stringify(activeDisasters, null, 2));
                    
                    // Format nearby disasters data if available
                    if (activeDisasters.length > 0) {
                        let disastersMessage = '🚨 *Nearby Active Disasters*\n\n';
                        
                        activeDisasters.forEach((disaster, index) => {
                            disastersMessage += `*${index + 1}. ${disaster.emergency_type || 'Disaster'}*\n`;
                            disastersMessage += `• Urgency: ${disaster.urgency_level || 'Unknown'}\n`;
                            if (disaster.latitude && disaster.longitude) {
                                disastersMessage += `• Location: https://www.google.com/maps?q=${disaster.latitude},${disaster.longitude}\n`;
                            }
                            if (disaster.people_count) {
                                disastersMessage += `• People affected: ${disaster.people_count}\n`;
                            }
                            disastersMessage += '\n';
                        });
                        
                        disastersMessage += '⚠️ Please take appropriate precautions and follow any evacuation orders.';
                        msg.reply(disastersMessage);
                    } else {
                        msg.reply(formatMessage.success('Good news! No active disasters were found near your location.'));
                    }
                }
                userStates.delete(senderId); // Clear state after check
                break;
        }
    }
};

module.exports = {
    handleNearbyDisasters
};
