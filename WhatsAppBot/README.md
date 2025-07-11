# WhatsApp Disaster Bot

## Overview
This is a WhatsApp automation bot built with Node.js and the whatsapp-web.js library. The bot is designed to assist with disaster-related communications and coordination.

## Features
- Automated message handling
- Group communication capabilities
- Disaster information dissemination
- Command-based interaction
- User-friendly formatted responses
- Modular architecture for easy maintenance and extension
- Location sharing support for disaster reporting and queries

## Prerequisites
- Node.js (v14 or higher)
- npm or pnpm

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd WhatsAppBot
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Setup
- The bot requires authentication via WhatsApp Web
- On first run, you'll need to scan a QR code with your WhatsApp mobile app

## Usage

Start the bot:
```bash
node main.js
```

The bot will generate a QR code (first time only) which you need to scan using the WhatsApp mobile app.

## Commands
The bot responds to the following commands:

- `!help` - Display help information and list of commands
- `!login` - Log in to your account (can share your location)
- `!profile` - View your user profile
- `!dashboard` - Access your user dashboard
- `!reportemergency` - Report an emergency situation
- `!nearbydisasters` - Check for disasters near your location (can share your location)
- `!logout` - Log out from your account
- `!cancel` - Cancel the current operation

## Location Sharing
For commands that require location data, you can:
1. Use WhatsApp's built-in location sharing feature
2. Or manually enter latitude and longitude coordinates