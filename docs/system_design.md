# Architecture Overview

## System Architecture

DevHub menggunakan **Microservices Architecture** dengan **Direct Service Access** dan **JWT Authentication**:

### Frontend Layer
- **Next.js 14** dengan App Router (Clean Structure - No `src/` folder)
- **TailwindCSS** untuk styling
- **React Query** untuk state management dan caching
- **Axios** untuk HTTP client dengan JWT interceptor
- Root-level `app/` dan `lib/` folders untuk struktur lebih clean
- **JWT Storage**: httpOnly cookie (recommended) atau localStorage (demo)

### Authentication Layer

#### Auth Service (Express.js + Clean Architecture)
- Port: 4000
- Database: PostgreSQL (shared)
- Architecture: Domain → Application → Infrastructure → Presentation
- Features:
  - User registration & login
  - JWT token generation (access + refresh)
  - httpOnly cookie management
  - User profile management
  - Admin dashboard
  - Service health monitoring
  - System statistics
- Use Cases: Register, Login, Refresh, GetProfile

**JWT Authentication:**
- **JWT (JSON Web Token)** untuk stateless authentication
- Shared secret across all microservices
- Token validation di setiap service independently
- Refresh token di httpOnly cookie (30 days)
- Access token di response body (7 days default)
- Auto-redirect ke login jika unauthorized (401)

### Microservices Layer

#### 1. Todo Service (NestJS + Clean Architecture)
- Port: 3001
- Database: PostgreSQL (shared)
- Architecture: Domain → Application → Infrastructure → Presentation
- Features: CRUD todos, statistics, filtering
- Use Cases: Create, Update, Get, Delete, Stats

#### 2. Notes Service (NestJS + Clean Architecture)
- Port: 3002
- Database: PostgreSQL (shared)
- Architecture: Domain → Application → Infrastructure → Presentation
- Features: 
  - Notes management
  - Code snippets
  - Full-text search
  - AI integration via service interface
- Use Cases: Create, Get, Search, Enhance

#### 3. CV Service (Go + GoFiber + Clean Architecture)
- Port: 3003
- Database: PostgreSQL (shared)
- Architecture: internal/domain → application → infrastructure → delivery
- Features:
  - CV CRUD operations
  - Experience, Education, Skills, Projects
  - Template selection
  - AI enhancement integration
  - PDF generation (planned)

#### 4. AI Service (FastAPI + Clean Architecture)
- Port: 8000
- No database (stateless)
- Architecture: Domain → Application → Infrastructure → Presentation
- Features:
  - Notes enhancement
  - CV optimization
  - Text generation
  - Translation
- Implementation: Gemini AI via interface abstraction

### Data Layer
- **PostgreSQL 15** (Mono Database)
- Single database shared by all services
- Tables isolated by domain

## Communication Flow (Direct Access + JWT)

```
User Browser
    ↓
Next.js Frontend (3000)
    ↓
    ├──→ Auth Service (4000) ──────→ Login/Register
    │    (JWT Generation)           ↓
    │                          PostgreSQL (5432)
    │
    ↓ (JWT Token in Authorization Header)
    ├──→ Todo Service (3001)  ──┐
    ├──→ Notes Service (3002) ──┤
    ├──→ CV Service (3003)    ──┼──→ PostgreSQL (5432)
    └──→ AI Service (8000)    ──┘
         (Each service validates JWT)
```

### Complete JWT Authentication Flow
```
1. User registers/login → Auth Service (4000)
2. Auth Service generates JWT tokens:
   - Access Token (7 days) → Response body
   - Refresh Token (30 days) → httpOnly cookie
3. Frontend stores access token (localStorage or memory)
4. Every API request includes: Authorization: Bearer <access_token>
5. Each microservice validates JWT independently (shared secret)
6. If expired → Use refresh token to get new access token
7. If invalid/expired → 401 → Redirect to login
```

### Admin Dashboard Flow
```
1. Admin login → Auth Service
2. Auth Service checks role = 'admin'
3. Admin endpoints:
   - GET /admin/health → Health of all services
   - GET /admin/users → List all users
   - GET /admin/stats → System statistics
   - PUT /admin/users/:id → Update user
   - DELETE /admin/users/:id → Delete user
```

## Design Patterns

### 1. Clean Architecture Pattern (All Services)
- **Domain Layer**: Entities, Repository Interfaces, Business Rules
- **Application Layer**: Use Cases, DTOs, Orchestration
- **Infrastructure Layer**: Repository Implementations, External Services
- **Presentation Layer**: Controllers, Routes, Middlewares
- **Dependency Rule**: Dependencies point inward (Domain is independent)
- **Benefits**: Testability, Maintainability, Flexibility, Framework Independence

### 2. JWT Authentication Pattern
- Stateless authentication mechanism
- Shared secret across all services
- Token contains user claims (id, email, role)
- Independent validation per service
- No centralized auth service needed

### 3. Direct Service Access Pattern
- Frontend calls services directly
- No API Gateway overhead
- Faster response times
- Simplified debugging
- Each service handles CORS independently

### 4. Microservices Pattern
- Independent deployment
- Technology diversity (NestJS, Go, Python)
- Isolated failures
- Each service follows Clean Architecture
- Shared JWT secret for auth

### 4. Mono Database Pattern
- Simplified data consistency
- ACID transactions
- Easier for small-medium scale

### 5. Repository Pattern
- Interface-based data access abstraction
- Domain layer defines interfaces
- Infrastructure layer implements
- Testable code with easy mocking
- Clear separation of concerns

### 6. Use Case Pattern
- Single responsibility per use case
- Application-specific business rules
- Orchestrates domain entities and repositories
- Independent and testable

### 7. Dependency Injection
- Constructor-based injection
- Interface-based dependencies
- Loose coupling between layers
- Easy testing with mocks

## Clean Architecture Implementation

### Layer Responsibilities

#### Domain Layer (Innermost - No Dependencies)
```
- Entities: Business objects (Todo, Note, CV)
- Repository Interfaces: Data access contracts
- Service Interfaces: External service contracts
- Business Rules: Core domain logic
- ⚠️ Cannot depend on outer layers
```

#### Application Layer (Depends on Domain)
```
- Use Cases: Application-specific business rules
  * CreateTodoUseCase, EnhanceNoteUseCase, etc.
- DTOs: Data Transfer Objects with validation
- Orchestration: Coordinates domain and infrastructure
```

#### Infrastructure Layer (Depends on Domain Interfaces)
```
- Repository Implementations: TypeORM, PostgreSQL
- Service Implementations: HTTP clients, AI services
- Configuration: Database configs, API endpoints
- External Integrations
```

#### Presentation Layer (Outermost - Depends on Application & Domain)
```
- Controllers/Handlers: HTTP request handling
- Routes: API endpoint definitions
- Middlewares: Request/response processing
- Filters: Error handling
```

### Dependency Flow
```
Presentation → Application → Domain ← Infrastructure
```

### Benefits Achieved

1. **Testability**
   - Easy unit testing of use cases
   - Mock dependencies via interfaces
   - Isolated business logic

2. **Maintainability**
   - Clear separation of concerns
   - Easy code location
   - Reduced coupling

3. **Flexibility**
   - Easy to swap implementations (e.g., change database)
   - Framework independent domain logic
   - Technology agnostic core

4. **Scalability**
   - Independent layer scaling
   - Easy feature additions
   - Parallel team development

## Technology Decisions

### Why JWT Authentication?
- Stateless - no session storage needed
- Scalable - no centralized auth bottleneck
- Fast - validation is local per service
- Standard - widely adopted and secure
- Simple - shared secret configuration

### Why Direct Service Access?
- Performance - no gateway overhead
- Simplicity - less moving parts
- Development - easier debugging
- Flexibility - services can scale independently

### Why NestJS?
- TypeScript support
- Built-in dependency injection
- Enterprise-ready
- Great TypeORM integration
- Easy JWT middleware integration

### Why Go (GoFiber)?
- High performance
- Excellent concurrency
- Small binary size
- Fast compilation

### Why FastAPI (Python)?
- Easy AI/ML integration
- Type hints support
- Auto-generated OpenAPI docs
- Async support

### Why PostgreSQL?
- Mature and reliable
- ACID compliant
- Rich feature set (arrays, JSON)
- Great performance

### Why Mono DB?
- Simpler for this scale
- Easier transactions
- Lower operational complexity
- Easy local development

## Scalability Considerations

### Current Architecture (Small-Medium Scale)
- Mono database
- Single instance per service
- Docker Compose orchestration

### Future Scaling (Large Scale)
- Separate database per service
- Kubernetes deployment
- Message queue (RabbitMQ/Kafka)
- Caching layer (Redis)
- Load balancer
- API Gateway enhancement (Kong/Envoy)

## Security Considerations

### Current Implementation
- CORS enabled
- Rate limiting on API Gateway
- Environment variables for secrets
- Input validation

### Future Enhancements
- JWT authentication
- Role-based access control
- API key management
- Request logging & monitoring
- DDoS protection
- SQL injection prevention
- XSS protection

## Performance Optimization

### Frontend
- React Query caching
- Code splitting
- Image optimization
- Lazy loading

### Backend
- Database indexing
- Connection pooling
- Async operations
- Response compression

### AI Service
- Request batching
- Response caching
- Rate limiting to Gemini API

## Monitoring & Observability (Planned)

- **Logging**: Winston, Morgan
- **Metrics**: Prometheus
- **Tracing**: Jaeger
- **Health Checks**: Custom endpoints
- **Error Tracking**: Sentry

## CI/CD Pipeline (Planned)

```
Git Push
    ↓
GitHub Actions
    ↓
├── Run Tests
├── Build Docker Images
├── Push to Registry
└── Deploy to Cloud
```

## Environment Setup

### Development
- Docker Compose
- Hot reload enabled
- Debug mode
- Local database

### Staging
- Kubernetes cluster
- Separate database
- Real AI integration
- Monitoring enabled

### Production
- Kubernetes cluster
- Managed database (AWS RDS)
- CDN for frontend
- Full monitoring
- Auto-scaling

## Data Flow Examples

### Creating a Todo
```
Frontend → API Gateway → Todo Service → PostgreSQL
```

### AI-Enhanced Note
```
Frontend → API Gateway → Notes Service → AI Service → Gemini API
                               ↓
                         PostgreSQL
```

### Building a CV
```
Frontend → API Gateway → CV Service → PostgreSQL
                               ↓
                        AI Service (for enhancement)
```
