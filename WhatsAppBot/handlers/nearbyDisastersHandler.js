const { formatMessage, validateInput } = require('../utils/messageFormatter');
const { makeApiRequest } = require('../api/apiClient');
const { extractLocationFromMessage } = require('../utils/locationHelper');

const handleNearbyDisasters = {
    /**
     * Start the nearby disasters check flow
     */
    startFlow: async (msg, senderId, userStates) => {
        userStates.set(senderId, { command: 'nearby_disasters', step: 1, data: {} });
        msg.reply(formatMessage.question('Please share your location by using WhatsApp\'s location sharing feature, or reply with your latitude (e.g., 34.0522).'));
    },
    
    /**
     * Continue the nearby disasters flow based on current step
     */
    continueFlow: async (msg, senderId, text, currentState, userTokens, userStates) => {
        const data = currentState.data;

        switch (currentState.step) {
            case 1: // Awaiting location or latitude
                // Check if this is a location message
                if (msg.type === 'location' || msg.hasMedia && msg.type === 'image' && msg._data && msg._data.isViewOnce) {
                    try {
                        const location = await extractLocationFromMessage(msg);
                        if (location) {
                            data.latitude = location.latitude;
                            data.longitude = location.longitude;
                            
                            // Skip to getting disasters since we have both coordinates
                            await checkForNearbyDisasters(msg, data, userTokens, senderId, userStates);
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
                await checkForNearbyDisasters(msg, data, userTokens, senderId, userStates);
                break;
        }
    }
};

// Helper function to check for disasters
async function checkForNearbyDisasters(msg, data, userTokens, senderId, userStates) {
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
        // Filter for only active disasters
        const disastersArray = Array.isArray(response.data) ? response.data : 
                             (response.data && response.data.disasters ? response.data.disasters : []);
        const activeDisasters = disastersArray.filter(disaster => disaster.status === 'active');
        
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
}

module.exports = {
    handleNearbyDisasters
};
