# Privacy Shield

A full-stack web application designed to provide privacy protection and secure data management solutions.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## About

Privacy Shield is a comprehensive privacy protection platform that helps users manage their digital footprint and secure their personal data. The application provides tools for data encryption, privacy analytics, and secure communication channels.

## Features

- 🔒 **Data Encryption**: End-to-end encryption for sensitive information
- 🛡️ **Privacy Dashboard**: Real-time privacy analytics and monitoring
- 🔐 **Secure Authentication**: Multi-factor authentication system
- 📊 **Data Management**: Comprehensive data tracking and control
- 🌐 **Cross-Platform**: Web-based solution accessible from any device
- ⚡ **Real-time Updates**: Live notifications and status updates

## Tech Stack

### Frontend

- React.js
- HTML5/CSS3
- JavaScript (ES6+)
- Modern UI/UX libraries

### Backend

- Node.js
- Express.js
- Database integration
- RESTful API architecture

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14.0 or higher)
- **npm** (version 6.0 or higher)
- **Git** (for cloning the repository)

You can verify your installations by running:

```bash
node --version
npm --version
git --version
```

## Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/privacy-shield.git
cd privacy-shield
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend/privacy-shield
npm install
```

### 3. Backend Setup

Open a new terminal window/tab and navigate to the backend directory:

```bash
cd backend
npm install
```

### 4. Environment Configuration

Create environment files for both frontend and backend:

**Frontend (.env):**

```env
VITE_BACKEND_URI = "http://localhost:8000"
VITE_WEB_URI = "https://privacy-shield-go.vercel.app/"
```

**Backend (.env):**

```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your email here
EMAIL_PASS=your email password
```

## Usage

### Starting the Application

You'll need to run both the frontend and backend servers simultaneously.

#### 1. Start the Backend Server

In your backend directory terminal:

```bash
node index.js
```

The backend server will start on `http://localhost:8000`

#### 2. Start the Frontend Development Server

In your frontend directory terminal:

```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

### Accessing the Application

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. The Privacy Shield application should now be running locally

### Available Scripts

#### Frontend Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run test` - Runs the test suite
- `npm run lint` - Runs ESLint for code quality

#### Backend Scripts

- `node index.js` - Starts the production server
- `npm run dev` - Starts the development server with nodemon (if configured)
- `npm test` - Runs backend tests

**Made with ❤️ for a more private internet**
