/**
 * Extract location coordinates from a WhatsApp message
 * @param {Object} msg - WhatsApp message object
 * @returns {Promise<Object|null>} - Object with latitude and longitude or null if location can't be extracted
 */
async function extractLocationFromMessage(msg) {
    try {
        // Check if it's a standard location message
        if (msg.type === 'location') {
            // Extract location data based on the message format
            const locationData = msg.location || msg._data?.location;
            if (locationData) {
                return {
                    latitude: parseFloat(locationData.latitude),
                    longitude: parseFloat(locationData.longitude)
                };
            }
        }
        
        // Handle live location or view-once location (format may vary based on WhatsApp Web API implementation)
        if (msg._data && msg._data.lat && msg._data.lng) {
            return {
                latitude: parseFloat(msg._data.lat),
                longitude: parseFloat(msg._data.lng)
            };
        }
        
        // For view-once location messages (which may be sent as images)
        if (msg.hasMedia && msg._data && msg._data.isViewOnce) {
            const media = await msg.downloadMedia();
            if (media && media.data) {
                // Location might be embedded in the media metadata
                // This is a simplified example, actual implementation may vary
                // depending on how WhatsApp embeds location data
                const caption = msg.caption || '';
                const locationMatch = caption.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
                if (locationMatch) {
                    return {
                        latitude: parseFloat(locationMatch[1]),
                        longitude: parseFloat(locationMatch[2])
                    };
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting location from message:', error);
        return null;
    }
}

module.exports = {
    extractLocationFromMessage
};
