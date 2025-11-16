# Changelog

All notable changes to DevHub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Real-time collaboration
- CV PDF export
- Email notifications
- Mobile app
- Dark mode toggle
- Search across all modules
- Data export/import
- Team workspaces
- Rate limiting per service
- OAuth2 integration (Google, GitHub)
- Two-factor authentication (2FA)

## [2.0.0] - 2025-11-16

### Added
#### Auth Service (New)
- Express.js Authentication Service with Clean Architecture
- User registration & login endpoints
- JWT token generation (access + refresh tokens)
- httpOnly cookie support for refresh tokens
- Password hashing with bcrypt
- Admin dashboard endpoints:
  - Health check for all services
  - User management (list, update, delete)
  - System statistics
- Role-based access control (user/admin)
- JWT middleware for protected routes

#### Architecture Changes
- **Removed API Gateway** - Transitioned to direct service access
- **Added Auth Service** - Centralized authentication (Port 4000)
- Frontend now calls microservices directly
- Each service validates JWT independently
- Improved performance (no gateway overhead)

#### Documentation
- Added `AUTH_SERVICE_API.md` - Complete auth endpoints documentation
- Added `JWT_AUTHENTICATION.md` - JWT implementation guide
- Added `MAIN_SERVICE_OPTIONS.md` - Auth service planning doc
- Updated all documentation for direct access architecture
- Security warnings for production deployment

### Changed
- Main service renamed to Auth Service
- Updated `docker-compose.yml` with auth-service configuration
- Updated `.env.example` with JWT secrets and service URLs
- All API examples now use direct service access
- Frontend `lib/api.ts` simplified for direct calls

### Security
- ✅ JWT Authentication implemented
- ✅ Token-based authorization
- ✅ Password hashing with bcrypt
- ✅ httpOnly cookies for refresh tokens
- ⚠️ Production security checklist added to documentation

## [1.0.0] - 2024-11-16

### Added
#### Frontend
- Next.js 14 application with App Router
- Responsive UI with TailwindCSS
- Dashboard homepage with feature cards
- Todo management page
- Notes management page
- CV builder page
- React Query for state management
- Toast notifications

#### Backend Services (v1.0.0 - Initial Release)
- Express.js API Gateway with rate limiting (replaced by Auth Service in v2.0.0)
- NestJS Todo Service with full CRUD and Clean Architecture
- NestJS Notes Service with AI integration and Clean Architecture
- Go Fiber CV Service with comprehensive CV management and Clean Architecture
- FastAPI AI Service with Google Gemini integration and Clean Architecture

#### Database
- PostgreSQL schema for all services
- Users, todos, notes, snippets tables
- CV-related tables (experiences, education, skills, projects)
- Database indexes for performance

#### AI Features
- **Notes AI Enhancement**:
  - Summarize notes
  - Improve content quality
  - Generate documentation
  - Explain code snippets
  - Generate tags
  
- **CV AI Enhancement**:
  - Rewrite professional summary
  - Improve experience bullet points
  - Generate skills suggestions
  - Translate content (EN/ID)
  - Suggest job titles
  - CV analysis

#### DevOps
- Docker Compose configuration
- Dockerfiles for all services
- Environment variable management
- Health check endpoints

#### Documentation
- Comprehensive README
- Quick start guide
- API examples with curl commands
- Architecture documentation
- Contributing guidelines
- Setup automation script

### Technical Specifications
- Node.js 20+ for JavaScript services
- Go 1.21+ for CV service
- Python 3.11+ for AI service
- PostgreSQL 15 as database
- Docker for containerization

### Features by Service

#### Todo Service (Port 3001)
- Create, read, update, delete todos
- Priority levels (low, medium, high)
- Status tracking (pending, in_progress, completed)
- Due dates
- Statistics dashboard

#### Notes Service (Port 3002)
- Create and manage notes
- Code snippets with language support
- Categories and tags
- Full-text search
- AI-powered enhancement
- Documentation generation

#### CV Service (Port 3003)
- Multiple CV management
- Work experience tracking
- Education history
- Skills categorization
- Project portfolio
- Template selection (modern, classic, minimal)
- AI-powered optimization

#### AI Service (Port 8000)
- Google Gemini integration
- Context-aware text generation
- Multi-language support
- Specialized prompts for different use cases
- Error handling and rate limiting

### Security
- CORS configuration
- Rate limiting on API Gateway
- Environment variable protection
- Input validation
- SQL injection prevention

### Performance
- Database indexing
- Connection pooling
- Response caching
- Async operations

## [0.1.0] - 2024-11-15

### Added
- Initial project structure
- Basic microservices architecture
- Database schema design

---

## Version History

### v1.0.0 - Initial Release
First stable release of DevHub with all core features implemented.

### Coming Soon
- v1.1.0 - User Authentication
- v1.2.0 - Real-time Features
- v1.3.0 - Mobile Apps
- v2.0.0 - Team Collaboration

---

**Note**: This project is actively developed. Check the [Issues](https://github.com/your-repo/issues) page for upcoming features and known bugs.
