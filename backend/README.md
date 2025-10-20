# Task Mate - Backend API

RESTful API backend for Task Mate task management application with AI-powered features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables (creates .env file)
npm run setup

# Start development server
npm run dev

# Start production server
npm start
```

## 📋 Prerequisites

- Node.js 16+ 
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key (for AI features)

## ⚙️ Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### How to Get API Keys:
- **MongoDB URI**: Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Gemini API**: Get free key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- **JWT Secrets**: Generate using `openssl rand -hex 64`

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "..." },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

---

### User Profile

#### Get Profile
```http
GET /users/profile
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

---

### Projects

#### Get All Projects
```http
GET /projects
Authorization: Bearer <access_token>
```

#### Get Single Project
```http
GET /projects/:id
Authorization: Bearer <access_token>
```

#### Create Project
```http
POST /projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description"
}
```

#### Update Project
```http
PUT /projects/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

#### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <access_token>
```

---

### Tasks

#### Get All Tasks in Project
```http
GET /projects/:projectId/tasks
Authorization: Bearer <access_token>
```

#### Get Single Task
```http
GET /projects/:projectId/tasks/:id
Authorization: Bearer <access_token>
```

#### Create Task
```http
POST /projects/:projectId/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "status": "todo",              // "todo" | "in-progress" | "done"
  "priority": "medium",           // "high" | "medium" | "low"
  "listSection": "today",         // "today" | "tomorrow" | "later"
  "color": "#3b82f6",
  "order": 0
}
```

#### Update Task
```http
PUT /projects/:projectId/tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "in-progress",
  "priority": "high",
  "completed": false
}
```

#### Update Task Status
```http
PATCH /projects/:projectId/tasks/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "done"
}
```

#### Delete Task
```http
DELETE /projects/:projectId/tasks/:id
Authorization: Bearer <access_token>
```

---

### AI Features

#### Chat with AI Assistant
```http
POST /ai/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "What are my high priority tasks?",
  "projectId": "optional_project_id"
}

Response:
{
  "success": true,
  "data": {
    "message": "AI response based on your tasks..."
  }
}
```

#### Get Project Summary
```http
POST /ai/summarize/:projectId
Authorization: Bearer <access_token>

Response:
{
  "success": true,
  "data": {
    "summary": "AI-generated project summary...",
    "stats": {
      "totalTasks": 10,
      "completedTasks": 3,
      "inProgressTasks": 4,
      "todoTasks": 3
    }
  }
}
```

---

### Health Check

```http
GET /health

Response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-20T..."
}
```

## 🛡️ Security Features

- **Helmet.js**: Secure HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 50 requests per 10 minutes per IP
- **JWT Authentication**: Access & refresh token strategy
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Joi schema validation

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **AI**: Google Gemini AI
- **Security**: Helmet, CORS, bcrypt
- **Logging**: Winston

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI, tokens)
│   ├── utils/           # Helpers, validators
│   └── app.js          # Express app setup
├── config/
│   └── database.js     # MongoDB connection
├── logs/               # Application logs
└── .env               # Environment variables
```

## 🔧 Available Scripts

```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm run setup    # Generate .env template
```

## 📝 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🚦 Development

1. Clone the repository
2. Run `npm install`
3. Run `npm run setup` to create `.env` template
4. Fill in your environment variables
5. Run `npm run dev`
6. API will be available at `http://localhost:5000`

