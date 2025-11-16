# DevHub - Quick Start Guide

## 🎯 Getting Started in 5 Minutes

### Option 1: Docker (Easiest)

1. **Install Docker Desktop**
   - Windows: https://www.docker.com/products/docker-desktop/
   - Pastikan Docker Desktop running

2. **Setup Environment**
   ```powershell
   # Copy environment file
   Copy-Item .env.example .env
   
   # Edit .env:
   # - Add GEMINI_API_KEY
   # - Set JWT_SECRET (important for authentication)
   notepad .env
   ```

3. **Start All Services**
   ```powershell
   docker-compose up -d --build
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Auth Service: http://localhost:4000
   - Todo Service: http://localhost:3001
   - Notes Service: http://localhost:3002
   - CV Service: http://localhost:3003
   - AI Service: http://localhost:8000

### Option 2: Manual Development

#### Prerequisites
```powershell
# Install Node.js 20
winget install OpenJS.NodeJS.LTS

# Install Go
winget install GoLang.Go

# Install Python
winget install Python.Python.3.11

# Install PostgreSQL
winget install PostgreSQL.PostgreSQL
```

#### Start Services

**Terminal 1 - Database**
```powershell
# Jalankan PostgreSQL dan create database
psql -U postgres
CREATE DATABASE devhub;
\c devhub
\i database/init.sql
```

**Terminal 2 - Frontend**
```powershell
cd devhub-fe-main-web
npm install
npm run dev
```

**Terminal 3 - Auth Service**
```powershell
cd devhub-be-main-service
npm install
npm run dev
```

**Terminal 4 - Todo Service**
```powershell
cd devhub-be-todo-service
npm install
npm run start:dev
```

**Terminal 5 - Notes Service**
```powershell
cd devhub-be-notes-service
npm install
npm run start:dev
```

**Terminal 6 - CV Service**
```powershell
cd devhub-be-cv-service
go mod download
go run cmd/main.go
```

**Terminal 7 - AI Service**
```powershell
cd devhub-be-ai-service
pip install -r requirements.txt
python main.py
```

## 🔑 Getting Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Login dengan Google Account
3. Click "Create API Key"
4. Copy dan paste ke `.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## ✅ Verify Installation

```powershell
# Check all services
curl http://localhost:3000  # Frontend
curl http://localhost:4000/health  # API Gateway
curl http://localhost:8000/health  # AI Service
```

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Check port usage
netstat -ano | findstr :3000
netstat -ano | findstr :4000

# Kill process
taskkill /PID <process_id> /F
```

### Docker Issues
```powershell
# Stop all containers
docker-compose down

# Remove volumes and restart
docker-compose down -v
docker-compose up -d --build
```

### Database Connection Error
```powershell
# Check PostgreSQL is running
docker-compose ps

# Restart database
docker-compose restart postgres
```

## 📖 Next Steps

1. Explore frontend at http://localhost:3000
2. Test API endpoints with Postman/Thunder Client
3. Read API documentation in README.md
4. Start building features!

## 🎓 Learning Resources

- **NestJS**: https://docs.nestjs.com
- **Next.js**: https://nextjs.org/docs
- **GoFiber**: https://docs.gofiber.io
- **FastAPI**: https://fastapi.tiangolo.com
- **Gemini AI**: https://ai.google.dev
