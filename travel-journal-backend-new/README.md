# Travel Journal Backend

## Overview
A backend application for a travel journal platform that allows users to create, manage, and share their travel experiences.

## Features
- User Authentication (Signup/Login)
- Create, Read, Update, Delete Journals
- Image Upload for Journals
- JWT-based Authentication
- Secure API Endpoints

## Prerequisites
- Node.js (v14+)
- MongoDB
- npm

## Installation
1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file with necessary configurations
4. Run the server
   ```
   npm run dev
   ```

## API Endpoints
- `/api/auth/signup`: Register a new user
- `/api/auth/login`: Authenticate user
- `/api/journals`: Create and retrieve journals
- `/api/journals/:id`: Get, update, or delete specific journal

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Server port

## Technologies
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer (File Upload)

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request