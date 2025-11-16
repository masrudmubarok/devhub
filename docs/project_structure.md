# DevHub - Project Structure

```
devhub/
│
├── 📁 devhub-fe-main-web/                 # Next.js Frontend (Clean Structure)
│   ├── app/                              # App Router (No src/)
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Homepage
│   │   ├── providers.tsx                 # React Query provider
│   │   ├── globals.css                   # Global styles
│   │   ├── todos/
│   │   │   └── page.tsx                  # Todo management page
│   │   ├── notes/
│   │   │   └── page.tsx                  # Notes page with AI
│   │   └── cv/
│   │       └── page.tsx                  # CV builder page
│   ├── lib/                              # Utilities (No src/)
│   │   ├── api.ts                        # Axios instances with JWT interceptor
│   │   └── api-client.ts                 # API functions (direct service access)
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── postcss.config.js
│   └── Dockerfile
│

├── 📁 devhub-be-todo-service/             # Todo Microservice (NestJS - Clean Architecture)
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── todo.entity.ts        # Todo entity
│   │   │   └── repositories/
│   │   │       └── todo.repository.interface.ts
│   │   ├── application/
│   │   │   ├── dtos/
│   │   │   │   └── todo.dto.ts           # DTOs with validation
│   │   │   └── use-cases/
│   │   │       ├── create-todo.use-case.ts
│   │   │       ├── update-todo.use-case.ts
│   │   │       ├── get-todos.use-case.ts
│   │   │       ├── delete-todo.use-case.ts
│   │   │       └── get-todo-stats.use-case.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── todo.repository.ts    # TypeORM implementation
│   │   │   └── config/
│   │   │       └── database.config.ts
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   │   └── todo.controller.ts    # HTTP endpoints
│   │   │   └── filters/
│   │   │       └── http-exception.filter.ts
│   │   ├── todo.module.ts                # Todo module
│   │   ├── app.module.ts                 # Root module
│   │   └── main.ts                       # Bootstrap
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── 📁 devhub-be-notes-service/            # Notes Microservice (NestJS - Clean Architecture)
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── note.entity.ts        # Note entity
│   │   │   │   └── snippet.entity.ts     # Snippet entity
│   │   │   ├── repositories/
│   │   │   │   ├── note.repository.interface.ts
│   │   │   │   └── snippet.repository.interface.ts
│   │   │   └── services/
│   │   │       └── ai.service.interface.ts
│   │   ├── application/
│   │   │   ├── dtos/
│   │   │   │   ├── note.dto.ts           # Note DTOs
│   │   │   │   └── snippet.dto.ts        # Snippet DTOs
│   │   │   └── use-cases/
│   │   │       └── notes/
│   │   │           ├── create-note.use-case.ts
│   │   │           ├── get-notes.use-case.ts
│   │   │           ├── search-notes.use-case.ts
│   │   │           └── enhance-note.use-case.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   ├── note.repository.ts    # TypeORM implementation
│   │   │   │   └── snippet.repository.ts
│   │   │   ├── services/
│   │   │   │   └── ai.service.ts         # HTTP AI client
│   │   │   └── config/
│   │   │       └── database.config.ts
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   │   └── note.controller.ts    # HTTP endpoints
│   │   │   └── filters/
│   │   │       └── http-exception.filter.ts
│   │   ├── notes.module.ts               # Notes module
│   │   ├── app.module.ts                 # Root module
│   │   └── main.ts                       # Bootstrap
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── 📁 devhub-be-cv-service/               # CV Microservice (Go + Fiber - Clean Architecture)
│   ├── cmd/
│   │   └── main.go                       # Application entry point
│   ├── internal/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── cv.go                 # Domain entities
│   │   │   ├── repositories/
│   │   │   │   └── repository.go         # Repository interfaces
│   │   │   └── services/
│   │   │       └── ai_service.go         # Service interfaces
│   │   ├── application/
│   │   │   ├── dto/
│   │   │   │   └── cv_dto.go             # DTOs
│   │   │   └── usecase/
│   │   │       └── cv_usecase.go         # Use cases
│   │   ├── infrastructure/
│   │   │   ├── repository/
│   │   │   │   └── cv_repository.go      # Repository implementation
│   │   │   ├── service/
│   │   │   │   └── ai_service.go         # AI service client
│   │   │   └── config/
│   │   │       └── config.go             # Configuration
│   │   └── delivery/
│   │       └── http/
│   │           ├── handler/
│   │           │   └── cv_handler.go     # HTTP handlers
│   │           └── middleware/
│   │               ├── logger.go
│   │               └── error.go
│   ├── go.mod                            # Go dependencies
│   └── Dockerfile
│
├── 📁 devhub-be-main-service/             # Auth Service (Express.js - Clean Architecture)
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── User.ts               # User entity
│   │   │   └── repositories/
│   │   │       └── IUserRepository.ts    # Repository interface
│   │   ├── application/
│   │   │   ├── dto/
│   │   │   │   ├── RegisterUserDTO.ts    # Registration DTO
│   │   │   │   ├── LoginUserDTO.ts       # Login DTO
│   │   │   │   └── TokenResponseDTO.ts   # Token response
│   │   │   └── use-cases/
│   │   │       ├── RegisterUserUseCase.ts
│   │   │       ├── LoginUserUseCase.ts
│   │   │       └── RefreshTokenUseCase.ts
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   │   ├── Database.ts           # PostgreSQL connection
│   │   │   │   └── UserRepository.ts     # Repository implementation
│   │   │   └── security/
│   │   │       ├── JWTService.ts         # JWT generation/validation
│   │   │       └── PasswordHasher.ts     # bcrypt wrapper
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   │   ├── AuthController.ts     # Auth endpoints
│   │   │   │   └── AdminController.ts    # Admin endpoints
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts        # Auth routes
│   │   │   │   └── admin.routes.ts       # Admin routes
│   │   │   └── middleware/
│   │   │       └── authMiddleware.ts     # JWT validation
│   │   └── index.ts                      # Bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── 📁 devhub-be-ai-service/               # AI Microservice (FastAPI - Clean Architecture)
│   ├── app/
│   │   ├── domain/
│   │   │   ├── schemas.py                # Pydantic models
│   │   │   └── services/
│   │   │       └── ai_service_interface.py
│   │   ├── application/
│   │   │   └── services/
│   │   │       └── gemini_service.py     # Gemini implementation
│   │   ├── infrastructure/
│   │   │   ├── config.py                 # Settings
│   │   │   └── logging.py                # Logging setup
│   │   └── presentation/
│   │       ├── routes/
│   │       │   ├── notes_routes.py
│   │       │   ├── cv_routes.py
│   │       │   └── generate_routes.py
│   │       └── middleware/
│   │           └── error_handler.py
│   ├── main.py                           # FastAPI app factory
│   ├── requirements.txt                  # Python dependencies
│   └── Dockerfile
│
├── 📁 database/                           # Database Schema
│   └── init.sql                          # PostgreSQL initialization
│
├── 📄 docker-compose.yml                  # Orchestration config
├── 📄 .env.example                        # Environment template
├── 📄 .gitignore                          # Git ignore rules
│
├── 📄 README.md                           # Main documentation
├── 📄 QUICKSTART.md                       # Quick setup guide
├── 📄 API_EXAMPLES.md                     # API usage examples
├── 📄 ARCHITECTURE.md                     # Architecture details
├── 📄 CONTRIBUTING.md                     # Contribution guide
├── 📄 CHANGELOG.md                        # Version history
├── 📄 LICENSE                             # MIT License
│
└── 📄 setup.ps1                           # Windows setup script
```

## 📊 Statistics

### Lines of Code (Approximate)
- Frontend: ~500 lines
- API Gateway: ~200 lines
- Todo Service: ~300 lines
- Notes Service: ~500 lines
- CV Service: ~600 lines
- AI Service: ~200 lines
- Database Schema: ~200 lines
- **Total: ~2,500 lines**

### Technologies Used
- **6 Different Technologies**: Next.js, Express.js, NestJS, Go, FastAPI, PostgreSQL
- **4 Programming Languages**: TypeScript, JavaScript, Go, Python
- **6 Microservices**: Frontend, Main Service, 3 Business Services, AI Service

### Features Count
- **3 Main Modules**: Todos, Notes, CV
- **10+ AI Enhancements**: Summarize, improve, generate, translate, etc.
- **20+ API Endpoints**: Full CRUD operations across services
- **10+ Database Tables**: Users, todos, notes, CV-related tables

## 🚀 Getting Started

1. **Prerequisites**: Install Docker Desktop
2. **Setup**: Run `./setup.ps1` and choose option 1
3. **Access**: Open http://localhost:3000
4. **Explore**: Test all features with demo user

## 📚 Documentation Files

| File | Description |
|------|-------------|
| README.md | Complete project overview and setup |
| QUICKSTART.md | 5-minute quick start guide |
| API_EXAMPLES.md | curl examples for all APIs |
| ARCHITECTURE.md | System design and architecture |
| CONTRIBUTING.md | How to contribute |
| CHANGELOG.md | Version history |

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| docker-compose.yml | Container orchestration |
| .env.example | Environment variables template |
| Dockerfile (x6) | Container definitions for each service |
| package.json (x4) | Node.js dependencies |
| go.mod | Go dependencies |
| requirements.txt | Python dependencies |
| tsconfig.json (x4) | TypeScript configuration |

## 🎯 Key Features by Service

### Frontend (Next.js)
- ✅ Responsive dashboard
- ✅ Todo management UI
- ✅ Notes with AI enhancement
- ✅ CV builder interface
- ✅ Real-time updates with React Query

### API Gateway (Express.js)
- ✅ Reverse proxy to all services
- ✅ Rate limiting
- ✅ CORS handling
- ✅ Health checks

### Todo Service (NestJS)
- ✅ CRUD operations
- ✅ Priority & status management
- ✅ Statistics endpoint
- ✅ Due date tracking

### Notes Service (NestJS)
- ✅ Notes CRUD
- ✅ Code snippets
- ✅ Search functionality
- ✅ AI enhancement integration
- ✅ Tags and categories

### CV Service (Go)
- ✅ CV management
- ✅ Experience tracking
- ✅ Education history
- ✅ Skills & projects
- ✅ Multiple templates

### AI Service (FastAPI)
- ✅ Gemini AI integration
- ✅ Notes enhancement (4 actions)
- ✅ CV optimization (5 actions)
- ✅ Content generation
- ✅ Translation support

## 🔐 Security Features

- ✅ Environment variable protection
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ⏳ JWT authentication (planned)
- ⏳ Role-based access (planned)

## 📈 Performance Optimizations

- ✅ Database indexing
- ✅ Connection pooling
- ✅ React Query caching
- ✅ Async operations
- ✅ Docker multi-stage builds

## 🎓 Learning Value

This project demonstrates:
- Microservices architecture
- Multiple tech stack integration
- RESTful API design
- Database design
- Docker containerization
- AI/ML integration
- Modern frontend development
- Backend API development

---

**Built with ❤️ for developers**

