# Notes App - MERN Stack 

This is a full-stack notes-taking application built with the MERN stack (MongoDB, Express.js, React, Node.js). The app supports login via Gmail OTP and Google OAuth. Users can create, view, and delete their personal notes after authentication.

## Features

- Login with Gmail OTP (JWT-based authentication)
- Login with Google OAuth
- Add, view, and delete personal notes
- Protected API routes using JWT
- Responsive UI using Tailwind CSS
- MongoDB Atlas for database storage

## Tech Stack

Frontend:
- React with Vite
- Tailwind CSS
- Axios
- Google OAuth (Client-side)

Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens for authentication
- Nodemailer for sending OTP emails
- Google OAuth (Server-side)

## Folder Structure

project-root/
  backend/
    controllers/
    routes/
    models/
    middleware/
    utils/
    config/
    server.js
  frontend/
    src/
      components/
      pages/
      context/
      App.jsx
      main.jsx
    vite.config.js

## Getting Started

1. Clone the repository:
   git clone https://github.com/ArnavNayakk/Noteverse/edit/main/Frontend.git
   cd your-repo

2. Backend Setup:
   cd backend
   npm install

   Create a .env file inside the backend directory:
   PORT=5000
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   Run the backend:
   npm run dev

3. Frontend Setup:
   cd ../frontend
   npm install

   Create a .env file inside the frontend directory:
   VITE_BACKEND_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id

   Run the frontend:
   npm run dev

## Authentication Flow

- Gmail OTP Login:
  The user enters their email, an OTP is sent, and upon entering the correct OTP, a JWT token is returned. This token is stored locally and used for all protected requests.

- Google OAuth Login:
  The user signs in using Google. The server verifies the token and issues its own JWT token for protected operations.

## Notes

- Ensure Google OAuth credentials allow localhost for development.
- The frontend and backend are decoupled and communicate via REST API.
- All note operations (create, get, delete) are protected and require a valid token.

## License

This project is open for personal and educational use. You are free to modify and extend it as needed.

