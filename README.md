# 🚀 DevHub - Developer Productivity Platform

DevHub is an all-in-one productivity platform for developers built with modern microservices architecture.

## 📚 Documentation

- **[Quick Start Guide](./docs/quickstart.md)** - Getting started quickly
- **[Project Structure](./docs/project_structure.md)** - Complete folder structure
- **[Clean Architecture](./docs/architecture.md)** - Detailed clean architecture implementation
- **[System Design](./docs/system_design.md)** - System design and patterns
- **[JWT Authentication](./docs/jwt_authentication.md)** - JWT authentication implementation
- **[Auth Service API](./docs/auth_service_api.md)** - Authentication & admin endpoints
- **[API Examples](./docs/api_examples.md)** - API endpoint examples
- **[Contributing](./docs/contributing.md)** - Contribution guidelines
- **[Changelog](./docs/changelog.md)** - Version history

## 📌 Key Features

### 1. **To-Do Management**
- ✅ CRUD todos with priority and due dates
- 📊 Statistics dashboard
- 🏷️ Status tracking (pending, in progress, completed)

### 2. **Notes & Knowledge Base** 
- 📝 Notes with categories and tags
- 💻 Code snippets with syntax highlighting
- 🤖 **AI Enhancement**:
  - Summarize notes
  - Improve content quality
  - Generate documentation
  - Explain code snippets
- 🔍 Full-text search

### 3. **CV Builder**
- 📄 Professional CV templates (Modern, Classic, Minimal)
- 👔 Experience, Education, Skills, Projects management
- 🤖 **AI Enhancement**:
  - Rewrite professional summary
  - Improve experience bullet points
  - Generate skills suggestions
  - Translate CV (EN/ID)
  - Suggest modern job titles
  - CV analysis & optimization tips

## 🏗️ Microservices Architecture (Direct Access + JWT)

```
                    ┌──────────────────────────────────────┐
                    │   Frontend (Next.js 14) - Port 3000  │
                    │     JWT Token in httpOnly Cookie     │
                    └────────────────┬─────────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                ▼                │
                    │     ┌──────────────────┐       │
                    │     │  Auth Service    │       │
                    │     │  Express.js      │       │
                    │     │  Port: 4000      │       │
                    │     │                  │       │
                    │     │  🔑 JWT Generate │       │
                    │     │  👤 User Mgmt    │       │
                    │     │  📊 Admin Dash   │       │
                    │     └──────────────────┘       │
                    │      Login/Register            │
                    └────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        │ Direct Access + JWT        │ Direct Access + JWT        │
        ▼                            ▼                            ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│ Todo Service │            │Notes Service │            │  CV Service  │
│   NestJS     │            │   NestJS     │            │   GoFiber    │
│   Port 3001  │            │   Port 3002  │            │   Port 3003  │
│   JWT ✓      │            │  JWT ✓       │            │   JWT ✓      │
└──────┬───────┘            └──────┬───────┘            └──────┬───────┘
       │                           │         🤖 AI Call      │
       │                           │                         │
       │                           └────────────┼────────────┘
       │                                        │
       │                                        ▼
       │                                ┌──────────────┐
       │                                │  AI Service  │
       │                                │   FastAPI    │
       │                                │  Port 8000   │
       │                                │   JWT ✓      │
       │                                │              │
       │                                │ 🧠 Gemini AI │
       │                                └──────┬───────┘
       │                                       │
       └───────────────────────────────────────┼
                                               │
                                               ▼
                                       ┌───────────────┐
                                       │  PostgreSQL   │
                                       │   Mono DB     │
                                       │   Port 5432   │
                                       └───────────────┘
```

**Architecture Highlights:**
- 🔐 **Auth Service** - Centralized authentication & admin dashboard (Port 4000)
- ✅ **Direct Service Access** - Frontend calls microservices directly
- 🔒 **JWT Authentication** - Stateless auth with shared secret
- ⚡ **Fast** - No gateway overhead, direct communication
- 🎯 **Simple** - Each service validates JWT independently

## 🛠️ Tech Stack

| Component | Technology | Architecture |
|-----------|-----------|-------------|
| Main Web | Next.js 14, TailwindCSS, TypeScript | Clean Structure (No src/) |
| Main Service | Express.js, JWT, bcrypt | Clean Architecture |
| Todo Service | NestJS, TypeORM | Clean Architecture + JWT |
| Notes Service | NestJS, TypeORM | Clean Architecture + JWT |
| CV Service | Go (GoFiber) | Clean Architecture + JWT |
| AI Service | Python (FastAPI), Google Gemini | Clean Architecture + JWT |
| Database | PostgreSQL (Mono DB) | Mono Database |
| Container | Docker, Docker Compose | Microservices |

## 🚀 Quick Start

### Docker (Recommended)
```bash
# 1. Setup environment
cp .env.example .env
# Edit .env - REQUIRED:
# - Add your GEMINI_API_KEY
# - Set JWT_SECRET (strong random key for authentication)

# 2. Start all services
docker-compose up -d --build

# 3. Access the application
# Frontend: http://localhost:3000
# Auth Service: http://localhost:4000
# Todo Service: http://localhost:3001
# Notes Service: http://localhost:3002
# CV Service: http://localhost:3003
# AI Service: http://localhost:8000
```

### 🔐 JWT Authentication

DevHub uses **JWT (JSON Web Token)** for stateless authentication:

**How it works:**
1. User logs in → Receives JWT token
2. Token stored securely (see security notes below)
3. Frontend automatically adds `Authorization: Bearer <token>` to all requests
4. Each microservice validates JWT independently using shared secret

**Configuration:**
```bash
# .env - Same JWT_SECRET for all services
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
```

**Benefits:**
- ✅ **Stateless** - No session storage needed
- ✅ **Scalable** - Each service validates independently
- ✅ **Fast** - No extra database lookups
- ✅ **Simple** - No centralized auth service required

⚠️ **Security Warning:** Current implementation uses `localStorage` for demo purposes. For production:
- **Recommended:** Use `httpOnly` cookies (immune to XSS attacks)
- **Alternative:** Memory storage + refresh token in httpOnly cookie
- **Avoid:** localStorage in production (vulnerable to XSS)

📖 **See [JWT Authentication Guide](./docs/jwt_authentication.md) for secure implementation details.**

### Manual Development
See **[Quick Start Guide](./docs/quickstart.md)** for detailed setup instructions.

**Prerequisites:** Node.js 20+, Go 1.21+, Python 3.11+, Docker, PostgreSQL 15+

## 📚 API Endpoints (Direct Access)

**Direct service access with JWT authentication:**

- **Todo Service:** `http://localhost:3001/todos/*` - CRUD todos, statistics
- **Notes Service:** `http://localhost:3002/notes/*` - CRUD notes, AI enhance, search
- **CV Service:** `http://localhost:3003/cv/*` - CRUD CV, experiences, education, skills
- **AI Service:** `http://localhost:8000/ai/*` - AI enhancements

**Authentication Header:**
```
Authorization: Bearer <your_jwt_token>
```

📖 **See [API Examples](./docs/api_example.md) for detailed endpoints and request examples.**

## 🤖 AI Features Powered by Google Gemini

### Notes Enhancement
- **Summarize** - Condense notes into brief versions
- **Improve** - Enhance writing quality
- **Generate Doc** - Generate developer documentation
- **Explain Code** - Explain code snippets

### CV Enhancement
- **Rewrite Summary** - Rewrite professional summary
- **Improve Experience** - Enhance experience bullet points
- **Generate Skills** - Generate skill suggestions
- **Translate** - Translate EN ↔ ID
- **Suggest Title** - Suggest modern job titles

📖 **See [API Examples](./docs/api_examples.md) for usage examples.**

## 🗄️ Database

**PostgreSQL 15** (Mono Database)

Schema defined in `database/init.sql` includes:
- Users, Todos, Notes, Snippets
- CVs, Experiences, Education, Skills, Projects

📖 **See [Project Structure](./docs/project_structure.md) for detailed schema.**

## 🐳 Docker

```bash
docker-compose up -d          # Start all services
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
```

📖 **See [Quick Start Guide](./docs/quickstart.md) for more Docker commands.**



## 📝 Development

- **Clean Architecture** - All services follow clean architecture pattern
- **Database Migrations** - Update `database/init.sql` and restart
- **Environment Variables** - Configure via `.env` file

📖 **See [Clean Architecture](./docs/architecture.md) and [Contributing](./docs/contributing.md) for guidelines.**

## 🔒 Security

**Implemented:**
- JWT Authentication ✅
- Token-based authorization ✅
- Input validation with class-validator ✅
- Environment variable configuration ✅

**Production Requirements (TODO):**
- ⚠️ **Critical:** Change JWT storage from localStorage to httpOnly cookies
- 🔐 Implement refresh token mechanism
- 🛡️ Add rate limiting per service (prevent DDoS)
- 🔒 Enable HTTPS only (SSL certificates)
- 🚫 Add CORS whitelist (restrict origins)
- 🔑 Implement token blacklist for logout
- 📝 Add API request logging and monitoring

## 🚀 Deployment

**Options:**
- Docker Swarm / Kubernetes
- Vercel (Frontend) + Railway/Render (Backend)
- AWS / DigitalOcean / Google Cloud

📖 **See [System Design](./docs/system_design.md) for deployment strategies.**

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

DevHub Team

---

**Happy Coding! 🚀**




