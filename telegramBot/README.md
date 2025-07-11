# 🚨 Disaster Alert Bot

A comprehensive Telegram bot for disaster management that helps users find nearby disasters, report emergencies, and access emergency services through an intuitive interface.

## 📋 Overview

The Disaster Alert Bot provides a real-time communication channel between emergency response teams and citizens during disaster situations. Built with Python and the Pyrogram framework, this bot offers a user-friendly interface for disaster reporting, monitoring, and response coordination.

## 🌟 Key Features

### 🔍 **Disaster Discovery**
- Find disasters near your location using `/nearby` command
- Share your GPS location to discover disasters in your area
- View detailed disaster information including type, urgency, affected people, and map locations
- Get Google Maps links for precise disaster locations

### 🔔 **Disaster Monitoring**
- Activate real-time disaster monitoring with `/monitor` command
- Receive alerts every 30 seconds when disasters occur in your area
- Stop monitoring at any time with `/stopmonitor` command
- One-click location sharing for easy setup

### 🚨 **Emergency Reporting**
- Step-by-step guided emergency reporting with `/report` command
- Support for multiple emergency types (Fire, Flood, Earthquake, Storm, etc.)
- Urgency level selection (Low, Medium, High, Critical)
- GPS location sharing for precise incident positioning
- Photo uploads for visual evidence
- Detailed situation descriptions and affected people count

### 👤 **User Management**
- Secure user authentication with `/login` command
- User profile management with `/profile` command
- Personal dashboard access with `/dashboard` command
- Location-based authentication for enhanced security
- Session management with `/logout` command

### 📊 **System Monitoring**
- Real-time disaster status checking with `/status` command
- System-wide emergency overview
- Current disaster statistics and trends

## 🛠️ Technology Stack

- **Python 3.x**: Core programming language
- **Pyrogram**: Telegram client library for Python
- **TgCrypto**: Cryptographic library for enhanced security
- **Requests**: HTTP client for API communication
- **python-dotenv**: Environment variable management

## 🔧 Setup and Installation

### Prerequisites
- Python 3.8 or higher
- Telegram API credentials (API ID, API Hash)
- Telegram Bot Token (from BotFather)
- Disaster Management API access

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd telegramBot
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   - Create a `.env` file or update the `config.py` file with your credentials:
   ```python
   # Telegram Bot Configuration
   API_ID = "your_api_id"
   API_HASH = "your_api_hash"
   BOT_TOKEN = "your_bot_token"

   # Disaster API Configuration
   BASE_URL = "http://localhost:8000"
   ```

5. **Start the bot:**
   ```bash
   python run_bot.py
   ```

## 🚀 Usage Guide

### Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Get started with the bot |
| `/help` | View all available commands |
| `/login` | Sign in to your account |
| `/profile` | View your profile information |
| `/dashboard` | Access your personal dashboard |
| `/status` | Check current system disaster status |
| `/nearby` | Find disasters near your location |
| `/monitor` | Start monitoring for disasters (checks every 30s) |
| `/stopmonitor` | Stop disaster monitoring |
| `/report` | Report a new emergency |
| `/logout` | Sign out from your account |

### Emergency Reporting Process

The `/report` command guides you through a 4-step process:

1. **Select emergency type**:
   - Fire, Flood, Earthquake, Storm, or Other

2. **Choose urgency level**:
   - Low, Medium, High, or Critical

3. **Describe the situation**:
   - Provide details about the emergency
   - Estimate the number of people affected

4. **Share information**:
   - Send your location for precise positioning
   - Optionally upload a photo as evidence

You can cancel the reporting process at any time by typing `/cancel`.

### Authentication

To use protected features, login with:
```
/login your_email@example.com your_password
```
Then share your location for verification when prompted.

## 💼 Business Benefits

- **Rapid Emergency Response**: Reduces response time by providing real-time disaster information
- **Enhanced Situational Awareness**: Provides emergency teams with visual evidence and precise locations
- **User-Friendly Interface**: Simple commands and guided reporting process for easy usage
- **Centralized Communication**: Creates a unified platform for citizens and emergency services
- **Location-Based Intelligence**: Enables geographically targeted disaster management
- **Data Collection**: Gathers valuable information for post-disaster analysis and future preparedness
- **Scalable Architecture**: Handles multiple simultaneous reports during large-scale emergencies

## 🛡️ Security Features

- **Secure Authentication**: Email/password with location verification
- **Token Management**: Secure API token handling
- **Session Controls**: User session management with logout capability
- **Temporary Storage**: Automatic cleanup of sensitive data
- **Input Validation**: Protection against malformed inputs

## 🧑‍💻 Project Structure

```
telegramBot/
├── main.py              # Main bot application with all handlers
├── disaster_api.py      # API integration for disaster management
├── config.py            # Configuration settings
├── run_bot.py           # Entry point script
├── requirements.txt     # Python dependencies
├── pyproject.toml       # Project metadata
└── README.md            # Documentation
```

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For questions and support, please create an issue in the repository or contact the development team.