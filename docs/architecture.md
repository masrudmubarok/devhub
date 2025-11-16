# DevHub - Clean Architecture
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

