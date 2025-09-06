# 🚀 DevBoard - Task Management System

A robust REST API for managing projects and tasks with user authentication, API key management, and file uploads. Built with Node.js, Express, Prisma, and PostgreSQL.

## ✨ Features

- **User Authentication & Authorization** - JWT-based authentication with refresh tokens
- **Project Management** - Create, read, update, and delete projects
- **Task Management** - Comprehensive task handling with status tracking and priority levels
- **Collaborators & Roles** - Add project collaborators with role-based permissions (OWNER/EDITOR/VIEWER)
- **API Key Management** - Secure API access with key-based authentication
- **File Uploads** - Support for task attachments using Cloudinary
- **Rate Limiting** - Built-in protection against abuse
- **Database** - PostgreSQL with Prisma ORM for type-safe database operations
- **Validation** - Request validation using express-validator

## 🏗️ Architecture

```
devBoard/
├── src/
│   ├── controllers/     # Business logic handlers
│   ├── middlewares/     # Authentication, validation, file upload
│   ├── routers/         # API route definitions
│   ├── utils/           # Helper functions (hashing, tokens, cloudinary)
│   ├── validator/       # Request validation schemas
│   ├── libs/           # Database connection
│   └── app.js          # Express app configuration
├── prisma/             # Database schema and migrations
└── public/             # Static files and uploads
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd devBoard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   PORT=8080
   DATABASE_URL="postgresql://<username>:<password>@localhost:<PORT>/<DB_NAME>"
   JWT_SECRET="your-jwt-secret-key"
   JWT_REFRESH_SECRET="your-refresh-secret-key"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:8080`

## 📚 API Documentation

### Base URL

```
http://localhost:8080/api/v1
```

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "image": [file] // optional profile image
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "cloudinary-url",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### Generate API Key

```http
POST /auth/api-key
Authorization: Bearer <access-token>
```

**Response:**

```json
{
  "success": true,
  "message": "API key generated successfully",
  "data": {
    "apiKey": "generated-api-key-string"
  }
}
```

### Projects

#### Create Project

```http
POST /projects
Authorization: Bearer <access-token>
X-API-Key: <api-key>
Content-Type: application/json

{
  "name": "E-commerce Website",
  "description": "A modern e-commerce platform with React frontend and Node.js backend"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "project": {
      "id": "uuid",
      "name": "E-commerce Website",
      "description": "A modern e-commerce platform with React frontend and Node.js backend",
      "createdBy": "user-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get All Projects

```http
GET /projects
Authorization: Bearer <access-token>
X-API-Key: <api-key>
```

#### Get Project by ID

```http
GET /projects/:id
Authorization: Bearer <access-token>
X-API-Key: <api-key>
```

#### Update Project

```http
PUT /projects/:id
Authorization: Bearer <access-token>
X-API-Key: <api-key>
Content-Type: application/json

{
  "name": "Updated E-commerce Website",
  "description": "Enhanced e-commerce platform with new features"
}
```

#### Delete Project

```http
DELETE /projects/:id
Authorization: Bearer <access-token>
X-API-Key: <api-key>
```

### Collaborators

#### List Collaborators for a Project

```http
GET /projects/:projectId/collaborators
Authorization: Bearer <access-token>
X-API-Key: <api-key>
```

#### Add Collaborator to a Project (OWNER)

```http
POST /projects/:projectId/collaborators
Authorization: Bearer <access-token>
X-API-Key: <api-key>
Content-Type: application/json

{
  "userId": "user-uuid",
  "role": "VIEWER" // VIEWER | EDITOR | OWNER
}
```

#### Update Collaborator Role (OWNER)

```http
PUT /projects/:projectId/collaborators/:collaboratorId
Authorization: Bearer <access-token>
X-API-Key: <api-key>
Content-Type: application/json

{
  "role": "EDITOR" // VIEWER | EDITOR | OWNER
}
```

#### Remove Collaborator (OWNER)

```http
DELETE /projects/:projectId/collaborators/:collaboratorId
Authorization: Bearer <access-token>
X-API-Key: <api-key>
```

### Tasks

#### Create Task

```http
POST /projects/:projectId/tasks
Authorization: Bearer <access-token>
X-API-Key: <api-key>
Content-Type: multipart/form-data

{
  "title": "Design User Interface",
  "description": "Create wireframes and mockups for the main pages",
  "assignedTo": "user-uuid",
  "priority": "HIGH",
  "dueAt": "2024-02-01T00:00:00.000Z",
  "attachments": [file1, file2] // optional, max 3 files
}
```

**Response:**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": "uuid",
      "title": "Design User Interface",
      "description": "Create wireframes and mockups for the main pages",
      "projectId": "project-uuid",
      "assignedTo": "user-uuid",
      "assignedBy": "current-user-uuid",
      "status": "TODO",
      "priority": "HIGH",
      "attachments": ["cloudinary-url1", "cloudinary-url2"],
      "dueAt": "2024-02-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get Tasks for Project

```http
GET /projects/:projectId/tasks
Authorization: Bearer <access-token>
X-API-Key: <api-key>
```

#### Update Task

```http
PUT /tasks/:id
Authorization: Bearer <access-token>
X-API-Key: <api-key>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "status": "INPROGRESS",
  "priority": "MEDIUM",
  "description": "Updated task description"
}
```

#### Delete Task

```http
DELETE /tasks/:id
Authorization: Bearer <access-token>
X-API-Key: <api-key>
```

## 🔐 Authentication & Authorization

### JWT Tokens

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token for getting new access tokens
- **API Key**: Additional security layer for sensitive operations

### Required Headers

```http
Authorization: Bearer <access-token>
X-API-Key: <api-key>
```

## 📊 Data Models

### User

- `id`: Unique identifier (UUID)
- `name`: User's full name
- `email`: Unique email address
- `image`: Profile image URL (optional)
- `password`: Hashed password
- `refreshToken`: JWT refresh token
- `createdAt`, `updatedAt`: Timestamps

### Project

- `id`: Unique identifier (UUID)
- `name`: Project name
- `description`: Project description (optional)
- `createdBy`: User ID who created the project
- `createdAt`, `updatedAt`, `deletedAt`: Timestamps

### Task

- `id`: Unique identifier (UUID)
- `title`: Task title
- `description`: Task description (optional)
- `projectId`: Associated project ID
- `assignedTo`: User ID assigned to the task
- `assignedBy`: User ID who assigned the task
- `status`: TODO, INPROGRESS, or DONE
- `priority`: EASY, MEDIUM, or HIGH
- `attachments`: Array of file URLs
- `dueAt`: Task due date (optional)
- `completedAt`: Task completion date (optional)
- `createdAt`, `updatedAt`, `deletedAt`: Timestamps

### ApiKey

- `id`: Unique identifier (UUID)
- `key`: Generated API key string
- `createdBy`: User ID who created the key
- `status`: ACTIVE or INACTIVE
- `expiresAt`: Key expiration date (optional)
- `createdAt`, `updatedAt`: Timestamps

### Collaborator

- `id`: Unique identifier (UUID)
- `userId`: Collaborator user's ID
- `projectId`: Associated project ID
- `role`: VIEWER, EDITOR, OWNER
- `createdAt`, `updatedAt`, `deletedAt`: Timestamps

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
```

### Database Migrations

```bash
npx prisma migrate dev    # Create and apply new migration
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio for database management
```

### Environment Variables

- `PORT`: Server port (default: 8080)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT access tokens
- `JWT_REFRESH_SECRET`: Secret for JWT refresh tokens
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **API Key Validation**: Additional security layer for sensitive operations
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Request data validation using express-validator
- **File Upload Security**: Secure file handling with Multer and Cloudinary

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## 📄 License

This project is licensed under the ISC License.

---

**Made by ❤️ Sumit Tomar**
