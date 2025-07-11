const { formatMessage, validateInput } = require('../utils/messageFormatter');
const { makeApiRequest } = require('../api/apiClient');
const { extractLocationFromMessage } = require('../utils/locationHelper');
const FormData = require('form-data');

const handleEmergencyReport = {
    /**
     * Start the emergency report flow
     */
    startFlow: async (msg, senderId, userStates) => {
        userStates.set(senderId, { command: 'report_emergency', step: 1, data: {} });
        msg.reply(formatMessage.question('What type of emergency is this? (e.g., flood, fire, earthquake)'));
    },
    
    /**
     * Continue the emergency report flow based on current step
     */
    continueFlow: async (msg, senderId, text, currentState, userTokens, userStates) => {
        const data = currentState.data;

        switch (currentState.step) {
            case 1: // Awaiting emergencyType
                if (!validateInput.nonEmpty(text).valid) {
                    msg.reply(formatMessage.error('Emergency type cannot be empty.'));
                    return;
                }
                
                data.emergencyType = text;
                currentState.step = 2;
                msg.reply(formatMessage.question('What is the urgency level of this emergency? (low, medium, high, critical)'));
                break;
                
            case 2: // Awaiting urgencyLevel
                const validUrgencyLevels = ['low', 'medium', 'high', 'critical'];
                if (!validUrgencyLevels.includes(text)) {
                    msg.reply(formatMessage.error(`Please specify a valid urgency level: ${validUrgencyLevels.join(', ')}`));
                    return;
                }
                
                data.urgencyLevel = text;
                currentState.step = 3;
                msg.reply(formatMessage.question('Please describe the situation in detail.'));
                break;
                
            case 3: // Awaiting situation
                if (!validateInput.nonEmpty(text).valid) {
                    msg.reply(formatMessage.error('Situation description cannot be empty.'));
                    return;
                }
                
                data.situation = text;
                currentState.step = 4;
                msg.reply(formatMessage.question('Approximately how many people are affected? (e.g., 10, 50+, unknown)'));
                break;
                
            case 4: // Awaiting peopleCount
                if (!validateInput.nonEmpty(text).valid) {
                    msg.reply(formatMessage.error('People count cannot be empty.'));
                    return;
                }
                
                data.peopleCount = text;
                currentState.step = 5;
                msg.reply(formatMessage.question('Please share your location using WhatsApp\'s location sharing feature, or provide the latitude of the emergency location.'));
                break;
                
            case 5: // Awaiting location or latitude
                // Check if this is a location message
                if (msg.type === 'location' || msg.hasMedia && msg.type === 'image' && msg._data && msg._data.isViewOnce) {
                    try {
                        const location = await extractLocationFromMessage(msg);
                        if (location) {
                            data.latitude = location.latitude.toString();
                            data.longitude = location.longitude.toString();
                            
                            // Skip to step 7 since we have both coordinates from the location share
                            currentState.step = 7;
                            msg.reply(formatMessage.info('Location received! You can optionally send an *image* of the situation now (as an attachment), or type `skip` to finish.'));
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
                
                data.latitude = latValidation.value.toString();
                currentState.step = 6;
                msg.reply(formatMessage.question('Now, please provide the longitude of the emergency location.'));
                break;
                
            case 6: // Awaiting longitude
                const longValidation = validateInput.coordinate(text, 'longitude');
                if (!longValidation.valid) {
                    msg.reply(formatMessage.error(longValidation.message));
                    return;
                }
                
                data.longitude = longValidation.value.toString();
                currentState.step = 7;
                msg.reply(formatMessage.info('You can optionally send an *image* of the situation now (as an attachment), or type `skip` to finish.'));
                break;
                
            case 7: // Awaiting image (optional) or 'skip'
                if (msg.hasMedia && msg.type === 'image') {
                    msg.reply(formatMessage.info('Downloading image...'));
                    const media = await msg.downloadMedia();
                    
                    if (media) {
                        const formData = new FormData();
                        formData.append('emergencyType', data.emergencyType);
                        formData.append('urgencyLevel', data.urgencyLevel);
                        formData.append('situation', data.situation);
                        formData.append('peopleCount', data.peopleCount);
                        formData.append('latitude', data.latitude);
                        formData.append('longitude', data.longitude);
                        formData.append('image', Buffer.from(media.data, 'base64'), {
                            filename: media.filename || 'emergency_image.jpeg',
                            contentType: media.mimetype
                        });

                        msg.reply(formatMessage.info('Reporting emergency with image...'));
                        const response = await makeApiRequest('POST', '/user/emergency/report', formData, senderId, userTokens);
                        
                        if (response.success) {
                            msg.reply(formatMessage.success('Your emergency has been reported successfully with the image!\n\nEmergency services have been notified and will respond as soon as possible.'));
                        } else {
                            msg.reply(formatMessage.error(`Failed to report emergency with image: ${response.error}`));
                        }
                    } else {
                        msg.reply(formatMessage.error('Could not download the image. Please try again or type `skip`.'));
                        return; // Stay in this step
                    }
                } else if (text === 'skip') {
                    msg.reply(formatMessage.info('Reporting emergency without image...'));
                    
                    const response = await makeApiRequest('POST', '/user/emergency/report', {
                        emergencyType: data.emergencyType,
                        urgencyLevel: data.urgencyLevel,
                        situation: data.situation,
                        peopleCount: data.peopleCount,
                        latitude: data.latitude,
                        longitude: data.longitude,
                    }, senderId, userTokens);
                    
                    if (response.success) {
                        msg.reply(formatMessage.success('Your emergency has been reported successfully!\n\nEmergency services have been notified and will respond as soon as possible.'));
                    } else {
                        msg.reply(formatMessage.error(`Failed to report emergency: ${response.error}`));
                    }
                } else {
                    msg.reply(formatMessage.warning('Please send an *image* or type `skip` to continue without an image.'));
                    return; // Stay in this step
                }
                userStates.delete(senderId); // Clear state after report attempt
                break;
        }
    }
};

module.exports = {
    handleEmergencyReport
};
