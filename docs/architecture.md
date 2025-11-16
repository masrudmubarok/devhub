# DevHub

## 📁 Project Structure

### ✅ Todo Service (NestJS)
```
devhub-be-todo-service/
├── src/
│   ├── domain/                          # Business Logic Layer
│   │   ├── entities/
│   │   │   └── todo.entity.ts
│   │   └── repositories/
│   │       └── todo.repository.interface.ts
│   ├── application/                     # Application Logic Layer
│   │   ├── dtos/
│   │   │   └── todo.dto.ts
│   │   └── use-cases/
│   │       ├── create-todo.use-case.ts
│   │       ├── update-todo.use-case.ts
│   │       ├── get-todos.use-case.ts
│   │       ├── delete-todo.use-case.ts
│   │       └── get-todo-stats.use-case.ts
│   ├── infrastructure/                  # External Dependencies Layer
│   │   ├── repositories/
│   │   │   └── todo.repository.ts
│   │   └── config/
│   │       └── database.config.ts
│   ├── presentation/                    # Presentation Layer
│   │   ├── controllers/
│   │   │   └── todo.controller.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── todo.module.ts
│   ├── app.module.ts
│   └── main.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

### ✅ Notes Service (NestJS)
```
devhub-be-notes-service/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── note.entity.ts
│   │   │   └── snippet.entity.ts
│   │   ├── repositories/
│   │   │   ├── note.repository.interface.ts
│   │   │   └── snippet.repository.interface.ts
│   │   └── services/
│   │       └── ai.service.interface.ts
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── note.dto.ts
│   │   │   └── snippet.dto.ts
│   │   └── use-cases/
│   │       └── notes/
│   │           ├── create-note.use-case.ts
│   │           ├── get-notes.use-case.ts
│   │           ├── search-notes.use-case.ts
│   │           └── enhance-note.use-case.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── note.repository.ts
│   │   │   └── snippet.repository.ts
│   │   ├── services/
│   │   │   └── ai.service.ts
│   │   └── config/
│   │       └── database.config.ts
│   ├── presentation/
│   │   ├── controllers/
│   │   │   └── note.controller.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── notes.module.ts
│   ├── app.module.ts
│   └── main.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

### ✅ Main Service - API Gateway (Express)
```
devhub-be-main-service/
├── src/
│   ├── domain/
│   │   └── services/
│   │       └── proxy.service.interface.ts
│   ├── infrastructure/
│   │   ├── config/
│   │   │   └── service.config.ts
│   │   └── services/
│   │       └── proxy.service.ts
│   ├── presentation/
│   │   ├── routes/
│   │   │   ├── todo.routes.ts
│   │   │   ├── notes.routes.ts
│   │   │   └── cv.routes.ts
│   │   └── middlewares/
│   │       ├── logging.middleware.ts
│   │       ├── rate-limit.middleware.ts
│   │       └── error.middleware.ts
│   └── index.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

### ✅ CV Service (GoFiber)
```
devhub-be-cv-service/
├── cmd/
│   └── main.go                          # Application entry point
├── internal/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── cv.go
│   │   ├── repositories/
│   │   │   └── repository.go
│   │   └── services/
│   │       └── ai_service.go
│   ├── application/
│   │   ├── dto/
│   │   │   └── cv_dto.go
│   │   └── usecase/
│   │       └── cv_usecase.go
│   ├── infrastructure/
│   │   ├── repository/
│   │   │   └── cv_repository.go
│   │   ├── service/
│   │   │   └── ai_service.go
│   │   └── config/
│   │       └── config.go
│   └── delivery/
│       └── http/
│           ├── handler/
│           │   └── cv_handler.go
│           └── middleware/
│               ├── logger.go
│               └── error.go
├── Dockerfile
├── go.mod
└── go.sum
```

### ✅ AI Service (FastAPI)
```
devhub-be-ai-service/
├── app/
│   ├── domain/
│   │   ├── schemas.py
│   │   └── services/
│   │       └── ai_service_interface.py
│   ├── application/
│   │   └── services/
│   │       └── gemini_service.py
│   ├── infrastructure/
│   │   ├── config.py
│   │   └── logging.py
│   └── presentation/
│       ├── routes/
│       │   ├── notes_routes.py
│       │   ├── cv_routes.py
│       │   └── generate_routes.py
│       └── middleware/
│           └── error_handler.py
├── main.py
├── requirements.txt
└── Dockerfile
```

---

## 🗑️ Removed Old Files/Folders

### Todo Service
- ❌ `src/todo/` (folder lengkap dengan semua file lama)

### Notes Service
- ❌ `src/notes/` (folder lengkap)
- ❌ `src/snippets/` (folder lengkap)

### Main Service
- ❌ `src/routes/` (folder lengkap)

### CV Service
- ❌ `main.go` (di root)
- ❌ `database/` (folder lengkap)
- ❌ `handlers/` (folder lengkap)
- ❌ `models/` (folder lengkap)

---

## 📐 Clean Architecture Layers

### 1. **Domain Layer** (Innermost)
- **Entities**: Business objects
- **Repository Interfaces**: Contracts untuk data access
- **Service Interfaces**: Contracts untuk external services
- **Business Rules**: Core business logic
- ⚠️ **Tidak boleh depend pada layer lain**

### 2. **Application Layer**
- **Use Cases**: Application-specific business rules
- **DTOs**: Data Transfer Objects dengan validation
- **Orchestration**: Koordinasi antara domain dan infrastructure
- ✅ **Depend pada**: Domain Layer

### 3. **Infrastructure Layer**
- **Repository Implementations**: Concrete data access
- **Service Implementations**: External service integrations
- **Configuration**: Database, API configs
- ✅ **Depend pada**: Domain Layer (via interfaces)

### 4. **Presentation Layer** (Outermost)
- **Controllers/Handlers**: HTTP request handling
- **Routes**: API endpoints
- **Middlewares**: Request/response processing
- **Filters**: Error handling
- ✅ **Depend pada**: Application & Domain Layers

---

## 🎯 Benefits of Clean Architecture

### 1. **Testability**
- Easy to unit test use cases
- Mock dependencies via interfaces
- Isolated business logic

### 2. **Maintainability**
- Clear separation of concerns
- Easy to locate code
- Reduced coupling

### 3. **Flexibility**
- Easy to swap implementations
- Database agnostic
- Framework independent

### 4. **Scalability**
- Independent layers can scale
- Easy to add new features
- Microservices ready

### 5. **Team Collaboration**
- Clear boundaries
- Parallel development
- Reduced merge conflicts

---

## 🔧 How to Run

### Development Mode

**Todo Service:**
```bash
cd devhub-be-todo-service
npm install
npm run start:dev
```

**Notes Service:**
```bash
cd devhub-be-notes-service
npm install
npm run start:dev
```

**Main Service:**
```bash
cd devhub-be-main-service
npm install
npm run dev
```

**CV Service:**
```bash
cd devhub-be-cv-service
go mod download
go run cmd/main.go
```

**AI Service:**
```bash
cd devhub-be-ai-service
pip install -r requirements.txt
python main.py
```

### Docker Compose (Recommended)
```bash
docker-compose up -d --build
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  (Controllers, Routes, Middlewares, Filters)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│          (Use Cases, DTOs, Orchestration)                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer                           │
│     (Entities, Interfaces, Business Rules)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                       │
│  (Repositories, Services, DB Config, External APIs)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Dependency Rule

Dependencies always point **INWARD**:

```
Presentation → Application → Domain ← Infrastructure
```

- ✅ Presentation dapat depend pada Application
- ✅ Application dapat depend pada Domain
- ✅ Infrastructure dapat depend pada Domain (via interfaces)
- ❌ Domain TIDAK BOLEH depend pada layer lain
- ❌ Inner layers tidak tahu tentang outer layers

---

Last Updated: November 16, 2025
