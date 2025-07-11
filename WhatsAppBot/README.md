# WhatsApp Disaster Management Bot

## Overview
The WhatsApp Disaster Management Bot is a powerful communication tool designed to facilitate disaster response coordination and emergency management through WhatsApp, the world's most popular messaging platform. This bot bridges the gap between disaster management authorities and affected communities, enabling efficient information exchange during critical situations.

## Features
- **User Authentication**: Secure login system to authenticate users and protect sensitive information
- **Emergency Reporting**: Report disasters with details including type, urgency, location, and affected population
- **Location Sharing**: Built-in location sharing for precise disaster reporting and nearby disaster checks
- **Media Support**: Upload images of emergency situations for better assessment
- **Disaster Proximity Detection**: Check for active disasters near your current location
- **Disaster Monitoring**: Continuously monitor for new disasters near your location with automatic alerts for one hour, with ability to stop monitoring at any time
- **User Profile Management**: View and manage your personal profile
- **Interactive Command System**: Easy-to-use command structure with helpful prompts
- **Formatted Responses**: Clear, formatted messages for easy readability in emergency situations
- **Multi-step Conversations**: Guided conversations for complex operations
- **Error Handling**: Robust error handling for reliable operation in critical situations

## Technologies
- **Node.js**: Server-side JavaScript runtime
- **WhatsApp Web.js**: Library for WhatsApp Web API integration
- **Puppeteer**: Headless browser automation for WhatsApp Web interaction
- **Axios**: HTTP client for API requests
- **FormData**: For handling multipart/form-data requests with file uploads
- **Modular Architecture**: Organized code structure for maintainability and extensibility

## Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- Google Chrome (for Puppeteer)
- Active WhatsApp account
- Internet connection

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd WhatsAppBot
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Configure the bot
Edit the `config.js` file to set your API endpoint and other configurations:
```javascript
module.exports = {
  API_BASE_URL: "http://your-api-endpoint.com",
  // Other configuration options...
}
```

### 4. Start the bot
```bash
npm start
```
On first run, you'll need to scan the generated QR code with your WhatsApp mobile app to authenticate.

## Commands
The bot responds to the following commands:

- `!help` - Display help information and list of commands
- `!login` - Log in to your account (with location sharing)
- `!profile` - View your user profile information
- `!reportemergency` - Report an emergency situation
- `!nearbydisasters` - Check for disasters near your location
- `!monitordisasters` - Start monitoring for new disasters near your location with automatic alerts
- `!stopmonitoring` - Stop the active disaster monitoring for your location
- `!logout` - Log out from your account
- `!cancel` - Cancel the current operation

## Architecture

The bot follows a modular architecture with these key components:

- `main.js`: Entry point that initializes the WhatsApp client and sets up event handlers
- `handlers/`: Command-specific handlers for different user interactions
- `api/`: API client for communication with the backend disaster management system
- `utils/`: Utility functions for formatting messages and handling location data
- `config.js`: Configuration settings for the bot

## Benefits

### For Disaster Management Authorities
- **Real-time Information**: Receive first-hand reports from affected areas
- **Enhanced Coordination**: Better coordinate rescue and relief operations
- **Wide Reach**: Leverage WhatsApp's extensive user base for maximum coverage
- **Resource Optimization**: Prioritize responses based on urgency levels
- **Visual Verification**: Receive images to verify reported emergencies

### For Communities and Individuals
- **Easy Access**: No need for specialized apps—use the familiar WhatsApp interface
- **Quick Reporting**: Report emergencies with essential details in a guided process
- **Stay Informed**: Check for nearby disasters to make safety decisions
- **Real-time Monitoring**: Set up continuous monitoring for new disasters in your area and receive immediate alerts when new emergencies are detected
- **Reduced Response Time**: Direct line to emergency services through WhatsApp
- **Low Data Usage**: Works efficiently even with limited connectivity

## Development

### Extending the Bot
The modular architecture makes it easy to add new commands:

1. Create a new handler in the `handlers/` directory
2. Add the command logic to handle user interactions
3. Register the new command in `commandHandler.js`

### Security Considerations
- User authentication is managed through secure tokens
- Personal data is only stored temporarily during the session
- Location data is only requested when necessary for disaster-related functions

## License
MIT

## Acknowledgements
- WhatsApp Web.js team for the excellent library
- Contributors to the Puppeteer project
- Disaster management organizations for providing requirements and feedback
