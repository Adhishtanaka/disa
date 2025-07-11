const { formatMessage, validateInput } = require("../utils/messageFormatter");
const { makeApiRequest } = require("../api/apiClient");
const { extractLocationFromMessage } = require("../utils/locationHelper");

const handleNearbyDisasters = {
  /**
   * Start the nearby disasters check flow
   */
  startFlow: async (msg, senderId, userStates) => {
    userStates.set(senderId, {
      command: "nearby_disasters",
      step: 1,
      data: {},
    });
    msg.reply(
      formatMessage.question(
        "Please share your location by using WhatsApp's location sharing feature, or reply with your latitude (e.g., 34.0522).",
      ),
    );
  },

  /**
   * Continue the nearby disasters flow based on current step
   */
  continueFlow: async (
    msg,
    senderId,
    text,
    currentState,
    userTokens,
    userStates,
  ) => {
    const data = currentState.data;

    switch (currentState.step) {
      case 1: // Awaiting location or latitude
        // Check if this is a location message
        if (
          msg.type === "location" ||
          (msg.hasMedia &&
            msg.type === "image" &&
            msg._data &&
            msg._data.isViewOnce)
        ) {
          try {
            const location = await extractLocationFromMessage(msg);
            if (location) {
              data.latitude = location.latitude;
              data.longitude = location.longitude;

              // Skip to getting disasters since we have both coordinates
              await checkForNearbyDisasters(
                msg,
                data,
                userTokens,
                senderId,
                userStates,
              );
              return;
            }
          } catch (error) {
            console.error("Error extracting location:", error);
            msg.reply(
              formatMessage.error(
                "Failed to process location. Please try again or enter coordinates manually.",
              ),
            );
            return;
          }
        }

        // If not a location message, proceed with manual latitude input
        const latValidation = validateInput.coordinate(text, "latitude");
        if (!latValidation.valid) {
          msg.reply(formatMessage.error(latValidation.message));
          return;
        }

        data.latitude = latValidation.value;
        currentState.step = 2;
        msg.reply(
          formatMessage.question("Now, please provide your longitude."),
        );
        break;

      case 2: // Awaiting longitude
        const longValidation = validateInput.coordinate(text, "longitude");
        if (!longValidation.valid) {
          msg.reply(formatMessage.error(longValidation.message));
          return;
        }

        data.longitude = longValidation.value;
        await checkForNearbyDisasters(
          msg,
          data,
          userTokens,
          senderId,
          userStates,
        );
        break;
    }
  },
};

// Helper function to check for disasters
async function checkForNearbyDisasters(
  msg,
  data,
  userTokens,
  senderId,
  userStates,
) {
  // Attempt to check for nearby disasters
  msg.reply(formatMessage.info("Checking for nearby disasters..."));

  const response = await makeApiRequest(
    "GET",
    `/public/nearby?latitude=${data.latitude}&longitude=${data.longitude}`,
    null,
    null,
    userTokens,
  );

  if (response.success) {
    // Filter for only active disasters
    const disastersArray = Array.isArray(response.data)
      ? response.data
      : response.data && response.data.disasters
        ? response.data.disasters
        : [];
    const activeDisasters = disastersArray.filter(
      (disaster) => disaster.status === "active",
    );

    // Format nearby disasters data if available
    if (activeDisasters.length > 0) {
      let disastersMessage = "🚨 *Nearby Active Disasters*\n\n";

      activeDisasters.forEach((disaster, index) => {
        disastersMessage += `*${index + 1}. ${disaster.emergency_type || "Disaster"}*\n`;
        disastersMessage += `• Urgency: ${disaster.urgency_level || "Unknown"}\n`;
        if (disaster.latitude && disaster.longitude) {
          disastersMessage += `• Location: https://www.google.com/maps?q=${disaster.latitude},${disaster.longitude}\n`;
        }
        if (disaster.people_count) {
          disastersMessage += `• People affected: ${disaster.people_count}\n`;
        }
        disastersMessage += "\n";
      });

      disastersMessage +=
        "⚠️ Please take appropriate precautions and follow any evacuation orders.";
      msg.reply(disastersMessage);
    } else {
      msg.reply(
        formatMessage.success(
          "Good news! No active disasters were found near your location.",
        ),
      );
    }
  }
  userStates.delete(senderId); // Clear state after check
}

// Build the handler for monitoring nearby disasters
const handleMonitorDisasters = {
  /**
   * Start the monitoring disasters flow
   */
  startFlow: async (msg, senderId, userStates) => {
    userStates.set(senderId, {
      command: "monitor_disasters",
      step: 1,
      data: {},
    });
    msg.reply(
      formatMessage.question(
        "To monitor disasters in your area, please share your location by using WhatsApp's location sharing feature, or reply with your latitude (e.g., 34.0522).",
      ),
    );
  },

  /**
   * Continue the monitoring flow based on current step
   */
  continueFlow: async (
    msg,
    senderId,
    text,
    currentState,
    userTokens,
    userStates,
  ) => {
    const data = currentState.data;

    switch (currentState.step) {
      case 1: // Awaiting location or latitude
        // Check if this is a location message
        if (
          msg.type === "location" ||
          (msg.hasMedia &&
            msg.type === "image" &&
            msg._data &&
            msg._data.isViewOnce)
        ) {
          try {
            const location = await extractLocationFromMessage(msg);
            if (location) {
              data.latitude = location.latitude;
              data.longitude = location.longitude;

              // Start monitoring since we have both coordinates
              await handleMonitorDisasters.startMonitoring(
                msg,
                senderId,
                userStates,
                data,
                userTokens,
              );
              return;
            }
          } catch (error) {
            console.error("Error extracting location:", error);
            msg.reply(
              formatMessage.error(
                "Failed to process location. Please try again or enter coordinates manually.",
              ),
            );
            return;
          }
        }

        // If not a location message, proceed with manual latitude input
        const latValidation = validateInput.coordinate(text, "latitude");
        if (!latValidation.valid) {
          msg.reply(formatMessage.error(latValidation.message));
          return;
        }

        data.latitude = latValidation.value;
        currentState.step = 2;
        msg.reply(
          formatMessage.question("Now, please provide your longitude."),
        );
        break;

      case 2: // Awaiting longitude
        const longValidation = validateInput.coordinate(text, "longitude");
        if (!longValidation.valid) {
          msg.reply(formatMessage.error(longValidation.message));
          return;
        }

        data.longitude = longValidation.value;
        await handleMonitorDisasters.startMonitoring(
          msg,
          senderId,
          userStates,
          data,
          userTokens,
        );
        break;
    }
  },

  /**
   * Start disaster monitoring for a specific location
   */
  startMonitoring: async (msg, senderId, userStates, data, userTokens) => {
    if (!data || !data.latitude || !data.longitude) {
      msg.reply(
        formatMessage.error(
          "Please share your location first before starting monitoring.",
        ),
      );
      return;
    }

    await monitorNearbyDisasters(msg, data, userTokens, senderId, userStates);
  },

  /**
   * Stop active monitoring for a user
   */
  stopMonitoring: (msg, senderId, userStates) => {
    const currentState = userStates.get(senderId);
    if (
      currentState &&
      currentState.data &&
      (currentState.data.isMonitoring ||
        currentState.command === "monitor_disasters")
    ) {
      currentState.data.isMonitoring = false;
      userStates.set(senderId, currentState);
      msg.reply(formatMessage.success("Disaster monitoring has been stopped."));
    } else {
      msg.reply(
        formatMessage.info("You don't have active disaster monitoring."),
      );
    }
  },
};

/**
 * Periodically check for nearby disasters using previously sent location
 * @param {Object} msg - The message object
 * @param {Object} data - Location data containing latitude and longitude
 * @param {Object} userTokens - User authentication tokens
 * @param {String} senderId - ID of the sender
 * @param {Map} userStates - Map of user states
 */
const monitorNearbyDisasters = async (
  msg,
  data,
  userTokens,
  senderId,
  userStates,
) => {
  if (!data.latitude || !data.longitude) {
    msg.reply(
      formatMessage.error("No location data available for monitoring."),
    );
    return;
  }

  // Store or update monitoring state
  const existingState = userStates.get(senderId) || {};
  userStates.set(senderId, {
    command: "monitor_disasters",
    data: {
      ...(existingState.data || {}),
      latitude: data.latitude,
      longitude: data.longitude,
      isMonitoring: true,
    },
  });

  msg.reply(
    formatMessage.info(
      "I will monitor this location and alert you about any new disasters.",
    ),
  );

  // Set up periodic checking (every 30 seconds)
  const checkInterval = setInterval(async () => {
    // Check if user is still monitoring
    const currentState = userStates.get(senderId);
    if (
      !currentState ||
      !currentState.data ||
      !currentState.data.isMonitoring
    ) {
      clearInterval(checkInterval);
      return;
    }

    console.log(
      `Checking disasters for user ${senderId} at coordinates ${data.latitude}, ${data.longitude}`,
    );

    try {
      const response = await makeApiRequest(
        "GET",
        `/public/nearby?latitude=${data.latitude}&longitude=${data.longitude}`,
        null,
        null,
        userTokens,
      );

      if (response.success) {
        const disastersArray = Array.isArray(response.data)
          ? response.data
          : response.data && response.data.disasters
            ? response.data.disasters
            : [];
        const activeDisasters = disastersArray.filter(
          (disaster) => disaster.status === "active",
        );

        // Compare with previously known disasters to identify new ones
        const knownDisasterIds = currentState.data.knownDisasterIds || [];
        const newDisasters = activeDisasters.filter(
          (d) => !knownDisasterIds.includes(d.id),
        );

        if (newDisasters.length > 0) {
          let alertMessage = "🚨 *ALERT: New Disasters Detected*\n\n";

          newDisasters.forEach((disaster, index) => {
            alertMessage += `*${index + 1}. ${disaster.emergency_type || "Disaster"}*\n`;
            alertMessage += `• Urgency: ${disaster.urgency_level || "Unknown"}\n`;
            if (disaster.latitude && disaster.longitude) {
              alertMessage += `• Location: https://www.google.com/maps?q=${disaster.latitude},${disaster.longitude}\n`;
            }
            alertMessage += "\n";
          });

          msg.reply(alertMessage);

          // Update known disaster IDs
          currentState.data.knownDisasterIds = [
            ...knownDisasterIds,
            ...newDisasters.map((d) => d.id),
          ];
          userStates.set(senderId, currentState);
        }
      }
    } catch (error) {
      console.error("Error monitoring disasters:", error);
      // Don't notify user of every error to avoid spam
    }
  }, 30000); // Check every 30 seconds

  // Auto-cancel after 1 hour to prevent indefinite monitoring
  setTimeout(() => {
    const state = userStates.get(senderId);
    if (state && state.command === "monitor_disasters") {
      clearInterval(checkInterval);
      userStates.delete(senderId);
      msg.reply(
        formatMessage.info(
          'Disaster monitoring has ended. Type "nearby disasters" to start again.',
        ),
      );
    }
  }, 3600000); // 1 hour
};

module.exports = {
  handleNearbyDisasters,
  handleMonitorDisasters,
};
