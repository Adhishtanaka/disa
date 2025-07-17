const { handleLogin } = require('./loginHandler');
const { handleEmergencyReport } = require('./emergencyReportHandler');
const { handleNearbyDisasters } = require('./nearbyDisastersHandler');
const { formatMessage } = require('../utils/messageFormatter');
const { makeApiRequest } = require('../api/apiClient');

/**
 * Sets up and directs message handling based on commands or conversation state
 */
async function setupCommandHandlers(client, msg, text, senderId, currentState, userTokens, userStates) {
    // If user is in multi-step conversation, handle that flow
    if (currentState) {
        // Allow users to cancel any multi-step process
        if (text === '!cancel') {
            userStates.delete(senderId);
            msg.reply(formatMessage.info('Current operation cancelled. How can I help you further? Type `!help` for options.'));
            return;
        }
        
        // Handle multi-step command based on current state
        switch (currentState.command) {
            case 'login':
                await handleLogin.continueFlow(msg, senderId, text, currentState, userTokens, userStates);
                break;
            case 'report_emergency':
                await handleEmergencyReport.continueFlow(msg, senderId, text, currentState, userTokens, userStates);
                break;
            case 'nearby_disasters':
                await handleNearbyDisasters.continueFlow(msg, senderId, text, currentState, userTokens, userStates);
                break;
            default:
                msg.reply(formatMessage.error('An unexpected error occurred in your conversation flow. Please try starting a new command with `!help`.'));
                userStates.delete(senderId);
        }
        return;
    }

    // Handle single-step commands or initiate multi-step commands
    switch (text) {
        case '!help':
            msg.reply(formatMessage.help());
            break;
            
        case '!login':
            if (userTokens.has(senderId)) {
                msg.reply(formatMessage.info('You are already logged in!'));
                return;
            }
            await handleLogin.startFlow(msg, senderId, userStates);
            break;
            
        case '!profile':
            await handleProfile(msg, senderId, userTokens);
            break;
            
        case '!dashboard':
            await handleDashboard(msg, senderId, userTokens);
            break;
            
        case '!reportemergency':
            if (!userTokens.has(senderId)) {
                msg.reply(formatMessage.warning('You need to be logged in to report an emergency. Type `!login` to proceed.'));
                return;
            }
            await handleEmergencyReport.startFlow(msg, senderId, userStates);
            break;
            
        case '!nearbydisasters':
            await handleNearbyDisasters.startFlow(msg, senderId, userStates);
            break;
            
        case '!logout':
            if (userTokens.has(senderId)) {
                userTokens.delete(senderId);
                userStates.delete(senderId);
                msg.reply(formatMessage.success('You have been successfully logged out.'));
            } else {
                msg.reply(formatMessage.info('You are not currently logged in.'));
            }
            break;
            
        default:
            // If not a recognized command
            msg.reply(formatMessage.info('I don\'t understand that command. Type `!help` to see what I can do.'));
    }
}

/**
 * Handle profile command
 */
async function handleProfile(msg, senderId, userTokens) {
    if (!userTokens.has(senderId)) {
        msg.reply(formatMessage.warning('You need to be logged in to view your profile. Type `!login` to proceed.'));
        return;
    }
    
    msg.reply(formatMessage.info('Fetching your profile...'));
    
    // Try private profile endpoint first, fall back to auth profile if needed
    let response = await makeApiRequest('GET', '/private/profile', null, senderId, userTokens);
    
    if (!response.success && response.status === 401) {
        // Try auth profile if private profile fails due to authentication
        response = await makeApiRequest('GET', '/auth/profile', null, senderId, userTokens);
    }

    if (response.success) {
        const profile = response.data;
        msg.reply(formatMessage.profile(profile));
    } else {
        msg.reply(formatMessage.error(`Failed to fetch profile: ${response.error}`));
        
        if (response.status === 401) {
            userTokens.delete(senderId);
            msg.reply(formatMessage.warning('Your session has expired. Please log in again using `!login`.'));
        }
    }
}

/**
 * Handle dashboard command
 */
async function handleDashboard(msg, senderId, userTokens) {
    if (!userTokens.has(senderId)) {
        msg.reply(formatMessage.warning('You need to be logged in to view your dashboard. Type `!login` to proceed.'));
        return;
    }
    
    msg.reply(formatMessage.info('Accessing your dashboard...'));
    
    const response = await makeApiRequest('GET', '/user/dashboard', null, senderId, userTokens);
    
    if (response.success) {
        // Format dashboard data if available
        const dashboard = response.data;
        if (dashboard && Object.keys(dashboard).length > 0) {
            let dashboardMessage = '📊 *Your Dashboard*\n\n';
            
            // Format dashboard data based on what's returned
            // This is a placeholder - modify according to actual API response structure
            if (dashboard.activeDisasters) {
                dashboardMessage += `*Active Disasters:* ${dashboard.activeDisasters.length}\n`;
            }
            if (dashboard.pendingTasks) {
                dashboardMessage += `*Pending Tasks:* ${dashboard.pendingTasks.length}\n`;
            }
            
            msg.reply(dashboardMessage);
        } else {
            msg.reply(formatMessage.info('Dashboard accessed successfully! No specific data to display.'));
        }
    } else {
        msg.reply(formatMessage.error(`Failed to access dashboard: ${response.error}`));
        
        if (response.status === 401) {
            userTokens.delete(senderId);
            msg.reply(formatMessage.warning('Your session has expired. Please log in again using `!login`.'));
        }
    }
}

module.exports = {
    setupCommandHandlers
};
