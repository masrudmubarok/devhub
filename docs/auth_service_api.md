# Auth Service - API Documentation

## Base URL
```
http://localhost:4000
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2025-11-16T10:30:00.000Z",
    "updated_at": "2025-11-16T10:30:00.000Z"
  }
}
```

---

### 2. Login

**POST** `/auth/login`

Login and receive JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Cookies Set:**
- `refresh_token` (httpOnly, secure in production, 30 days expiry)

---

### 3. Refresh Token

**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request (Cookies automatically sent):**
```bash
POST /auth/refresh
Cookie: refresh_token=<refresh_token>
```

**Or with Body:**
```json
{
  "refreshToken": "<refresh_token>"
}
```

**Response (200 OK):**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d"
}
```

---

### 4. Get Current User Profile

**GET** `/auth/me`

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2025-11-16T10:30:00.000Z",
    "updated_at": "2025-11-16T10:30:00.000Z"
  }
}
```

---

### 5. Logout

**POST** `/auth/logout`

Logout and clear refresh token cookie.

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## ⚙️ Admin Endpoints

All admin endpoints require:
- Authentication (JWT token)
- Admin role

### 1. Health Check (All Services)

**GET** `/admin/health`

Check health status of all microservices.

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-16T10:30:00.000Z",
  "services": [
    {
      "name": "Todo Service",
      "url": "http://localhost:3001",
      "status": "healthy",
      "response": { "status": "healthy" }
    },
    {
      "name": "Notes Service",
      "url": "http://localhost:3002",
      "status": "healthy",
      "response": { "status": "healthy" }
    },
    {
      "name": "CV Service",
      "url": "http://localhost:3003",
      "status": "healthy",
      "response": { "status": "healthy" }
    },
    {
      "name": "AI Service",
      "url": "http://localhost:8000",
      "status": "healthy",
      "response": { "status": "ok" }
    },
    {
      "name": "Database",
      "status": "healthy"
    }
  ]
}
```

---

### 2. List All Users

**GET** `/admin/users`

Get paginated list of all users (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `limit` (optional, default: 50) - Number of users per page
- `offset` (optional, default: 0) - Pagination offset

**Example:**
```
GET /admin/users?limit=20&offset=0
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "created_at": "2025-11-16T10:30:00.000Z",
      "updated_at": "2025-11-16T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 3. System Statistics

**GET** `/admin/stats`

Get system-wide statistics (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200 OK):**
```json
{
  "timestamp": "2025-11-16T10:30:00.000Z",
  "stats": {
    "users": 150,
    "todos": 523,
    "notes": 342,
    "cvs": 78
  }
}
```

---

### 4. Update User

**PUT** `/admin/users/:id`

Update user information (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "email": "jane@example.com",
    "name": "Jane Smith",
    "role": "admin",
    "created_at": "2025-11-16T10:30:00.000Z",
    "updated_at": "2025-11-16T11:00:00.000Z"
  }
}
```

---

### 5. Delete User

**DELETE** `/admin/users/:id`

Delete a user (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

## 🔑 JWT Token Structure

**Access Token Payload:**
```json
{
  "sub": 1,                    // User ID
  "email": "user@example.com",
  "role": "user",
  "iat": 1699996800,           // Issued At
  "exp": 1700601600            // Expiration
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Email, password, and name are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 🧪 Testing with curl

### Register
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' \
  -c cookies.txt
```

### Get Profile
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Admin Health Check
```bash
curl -X GET http://localhost:4000/admin/health \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

Last Updated: November 16, 2025
