# DevHub - JWT Authentication Documentation

## Overview

DevHub uses **JWT (JSON Web Token)** for stateless authentication across all microservices. Each service validates tokens independently without requiring a centralized authentication service.

---

## 🔐 How JWT Works in DevHub

### Architecture Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    User Login Request                         │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
                    ┌─────────────────┐
                    │  Any Service    │
                    │  (Login Route)  │
                    └────────┬────────┘
                             ↓
                    Generate JWT Token
                    (user_id, email, role)
                             ↓
                    ┌─────────────────┐
                    │  Return Token   │
                    │  to Frontend    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │  localStorage   │
                    │  jwt_token      │
                    └─────────────────┘

┌──────────────────────────────────────────────────────────────┐
│               Authenticated API Requests                      │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
              Frontend adds JWT to header:
              Authorization: Bearer <token>
                             ↓
       ┌──────────┬──────────┬──────────┬──────────┐
       ↓          ↓          ↓          ↓          ↓
  Todo Service Notes Service CV Service AI Service
       │          │          │          │          │
       └──────────┴──────────┴──────────┴──────────┘
                Each validates JWT independently
```

---

## 🔧 Configuration

### Shared JWT Secret

All services must use the **same JWT secret** for token generation and validation:

```bash
# .env (shared across all services)
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
```

⚠️ **Important:** Use a strong, random secret in production (minimum 32 characters)

---

## 🚀 Implementation by Service

### Frontend (Next.js)

**Location:** `lib/api.ts`

```typescript
// JWT token storage
const token = localStorage.getItem('jwt_token')

// Axios interceptor - auto-attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 Unauthorized
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Backend Services (NestJS - Todo & Notes)

**1. Install dependencies:**
```bash
npm install @nestjs/jwt @nestjs/passport passport-jwt
npm install -D @types/passport-jwt
```

**2. JWT Module Configuration:**
```typescript
// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email,
      role: payload.role 
    };
  }
}
```

**3. JWT Guard:**
```typescript
// auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**4. Protect Routes:**
```typescript
// controllers/todo.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard) // Apply to all routes
export class TodoController {
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.userId; // From JWT payload
    return this.todoService.findAll(userId);
  }
}
```

### CV Service (Go + Fiber)

**1. Install JWT library:**
```bash
go get github.com/golang-jwt/jwt/v5
```

**2. JWT Middleware:**
```go
// internal/delivery/http/middleware/jwt.go
package middleware

import (
    "os"
    "strings"
    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
    UserID int    `json:"sub"`
    Email  string `json:"email"`
    Role   string `json:"role"`
    jwt.RegisteredClaims
}

func JWTMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        authHeader := c.Get("Authorization")
        if authHeader == "" {
            return c.Status(401).JSON(fiber.Map{
                "error": "Missing authorization header",
            })
        }

        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
        
        token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            return c.Status(401).JSON(fiber.Map{
                "error": "Invalid token",
            })
        }

        claims := token.Claims.(*Claims)
        c.Locals("userId", claims.UserID)
        c.Locals("email", claims.Email)
        
        return c.Next()
    }
}
```

**3. Apply Middleware:**
```go
// cmd/main.go
app := fiber.New()

// Public routes
app.Post("/auth/login", authHandler.Login)

// Protected routes
cvRoutes := app.Group("/cv", middleware.JWTMiddleware())
cvRoutes.Get("/", cvHandler.GetAll)
cvRoutes.Post("/", cvHandler.Create)
```

### AI Service (Python + FastAPI)

**1. Install dependencies:**
```bash
pip install python-jose[cryptography] passlib[bcrypt]
```

**2. JWT Utilities:**
```python
# app/infrastructure/auth/jwt.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

**3. Protect Routes:**
```python
# app/presentation/routes/ai_routes.py
from fastapi import APIRouter, Depends
from app.infrastructure.auth.jwt import verify_token

router = APIRouter()

@router.post("/notes/enhance")
async def enhance_note(
    request: EnhanceRequest,
    current_user: dict = Depends(verify_token)
):
    user_id = current_user["sub"]
    # Process request
    return response
```

---

## 🔑 JWT Token Structure

### Payload Example

```json
{
  "sub": 1,                          // User ID
  "email": "user@example.com",
  "role": "user",                    // or "admin"
  "iat": 1699996800,                 // Issued At
  "exp": 1700601600                  // Expiration (7 days)
}
```

### Token Generation Example (NestJS)

```typescript
import { JwtService } from '@nestjs/jwt';

async generateToken(user: User) {
  const payload = { 
    sub: user.id, 
    email: user.email,
    role: user.role 
  };
  
  return {
    access_token: this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    })
  };
}
```

---

## 🛡️ Security Best Practices

### 1. **Strong Secret Key**
```bash
# Generate a secure random key
openssl rand -base64 32

# Use in .env
JWT_SECRET=generatedSecureKeyHere123456789abcdef
```

### 2. **Token Expiration**
```bash
# Short-lived tokens for better security
JWT_EXPIRES_IN=7d        # 7 days
# or
JWT_EXPIRES_IN=24h       # 24 hours
```

### 3. **HTTPS Only in Production**
- Never transmit JWT over HTTP
- Always use HTTPS in production
- Set secure cookie flags if using cookies

### 4. **Token Storage**
```typescript
// ✅ Good: localStorage (for web apps)
localStorage.setItem('jwt_token', token)

// ❌ Bad: sessionStorage (lost on tab close)
// ❌ Bad: cookies without httpOnly flag
```

### 5. **Refresh Tokens (Optional Enhancement)**
```typescript
// Implement refresh token for better UX
{
  access_token: "short-lived-token",  // 15 minutes
  refresh_token: "long-lived-token"   // 7 days
}
```

---

## 🔄 Authentication Flow

### 1. **Login**

```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

### 2. **Store Token**

```typescript
// Frontend
const response = await fetch('/auth/login', { ... })
const data = await response.json()
localStorage.setItem('jwt_token', data.access_token)
```

### 3. **Make Authenticated Requests**

```bash
GET http://localhost:3001/todos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. **Logout**

```typescript
// Frontend
localStorage.removeItem('jwt_token')
window.location.href = '/login'
```

---

## 🐛 Troubleshooting

### Issue: "Invalid token" error

**Solutions:**
1. Check JWT_SECRET matches across all services
2. Verify token hasn't expired
3. Ensure Bearer prefix in Authorization header
4. Check token format (no extra spaces)

```bash
# Debug token
curl -X GET http://localhost:3001/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -v
```

### Issue: CORS errors with JWT

**Solution:** Configure CORS in each service
```typescript
// NestJS
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

### Issue: Token expires too quickly

**Solution:** Adjust expiration time
```bash
# .env
JWT_EXPIRES_IN=30d  # Increase to 30 days
```

---

## 📊 Comparison: JWT vs Session

| Feature | JWT | Session |
|---------|-----|---------|
| **Storage** | Client-side (localStorage) | Server-side (Redis/DB) |
| **Stateless** | ✅ Yes | ❌ No |
| **Scalability** | ✅ High | ⚠️ Requires shared session store |
| **Performance** | ✅ Fast (no DB lookup) | ⚠️ DB lookup per request |
| **Logout** | ⚠️ Can't revoke (use expiration) | ✅ Easy revocation |
| **Microservices** | ✅ Perfect fit | ❌ Complicated |
| **Security** | ⚠️ XSS risk | ⚠️ CSRF risk |

---

## 🚀 Future Enhancements

- [ ] Refresh token implementation
- [ ] Token blacklist for logout
- [ ] Role-based access control (RBAC)
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Token rotation on usage
- [ ] Rate limiting per user

---

Last Updated: November 16, 2025
