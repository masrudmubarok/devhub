# DevHub Setup Script for Windows PowerShell

Write-Host "🚀 DevHub Setup Script" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please update it with your Gemini API key!" -ForegroundColor Green
    Write-Host "Get your API key at: https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Select setup option:" -ForegroundColor Yellow
Write-Host "1. Docker Setup (Recommended - runs everything)" -ForegroundColor White
Write-Host "2. Development Setup (Manual - for development)" -ForegroundColor White
Write-Host "3. Install Dependencies Only" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🐳 Starting Docker Setup..." -ForegroundColor Cyan
        
        # Check if Docker is running
        $dockerRunning = docker info 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✅ Docker is running" -ForegroundColor Green
        Write-Host "📦 Building and starting all services..." -ForegroundColor Yellow
        
        docker-compose up -d --build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ All services started successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🌐 Service URLs:" -ForegroundColor Cyan
            Write-Host "   Frontend:    http://localhost:3000" -ForegroundColor White
            Write-Host "   API Gateway: http://localhost:4000" -ForegroundColor White
            Write-Host "   Todo Service: http://localhost:3001" -ForegroundColor White
            Write-Host "   Notes Service: http://localhost:3002" -ForegroundColor White
            Write-Host "   CV Service: http://localhost:3003" -ForegroundColor White
            Write-Host "   AI Service: http://localhost:8000" -ForegroundColor White
            Write-Host ""
            Write-Host "📊 View logs: docker-compose logs -f" -ForegroundColor Yellow
            Write-Host "🛑 Stop services: docker-compose down" -ForegroundColor Yellow
        } else {
            Write-Host "❌ Failed to start services" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔧 Development Setup..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Installing dependencies for all services..." -ForegroundColor Yellow
        
        # Frontend
        Write-Host ""
        Write-Host "📦 Installing Frontend dependencies..." -ForegroundColor Cyan
        Set-Location "devhub-fe-main-web"
        npm install
        Set-Location ".."
        
        # Main Service
        Write-Host ""
        Write-Host "📦 Installing Main Service dependencies..." -ForegroundColor Cyan
        Set-Location "devhub-be-main-service"
        npm install
        Set-Location ".."
        
        # Todo Service
        Write-Host ""
        Write-Host "📦 Installing Todo Service dependencies..." -ForegroundColor Cyan
        Set-Location "devhub-be-todo-service"
        npm install
        Set-Location ".."
        
        # Notes Service
        Write-Host ""
        Write-Host "📦 Installing Notes Service dependencies..." -ForegroundColor Cyan
        Set-Location "devhub-be-notes-service"
        npm install
        Set-Location ".."
        
        # CV Service
        Write-Host ""
        Write-Host "📦 Installing CV Service dependencies..." -ForegroundColor Cyan
        Set-Location "devhub-be-cv-service"
        go mod download
        Set-Location ".."
        
        # AI Service
        Write-Host ""
        Write-Host "📦 Installing AI Service dependencies..." -ForegroundColor Cyan
        Set-Location "devhub-be-ai-service"
        pip install -r requirements.txt
        Set-Location ".."
        
        Write-Host ""
        Write-Host "✅ All dependencies installed!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To start development:" -ForegroundColor Yellow
        Write-Host "1. Start PostgreSQL (or use: docker-compose up postgres -d)" -ForegroundColor White
        Write-Host "2. Run each service in separate terminal:" -ForegroundColor White
        Write-Host "   - Frontend: cd devhub-fe-main-web && npm run dev" -ForegroundColor White
        Write-Host "   - Main Service: cd devhub-be-main-service && npm run dev" -ForegroundColor White
        Write-Host "   - Todo Service: cd devhub-be-todo-service && npm run start:dev" -ForegroundColor White
        Write-Host "   - Notes Service: cd devhub-be-notes-service && npm run start:dev" -ForegroundColor White
        Write-Host "   - CV Service: cd devhub-be-cv-service && go run main.go" -ForegroundColor White
        Write-Host "   - AI Service: cd devhub-be-ai-service && python main.py" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 Tip: Check QUICKSTART.md for detailed instructions" -ForegroundColor Cyan
    }
    
    "3" {
        Write-Host ""
        Write-Host "📦 Installing Dependencies Only..." -ForegroundColor Cyan
        
        # Frontend
        Write-Host "Frontend..." -ForegroundColor Yellow
        Set-Location "devhub-fe-main-web"
        npm install
        Set-Location ".."
        
        # Backend Services
        Write-Host "Main Service..." -ForegroundColor Yellow
        Set-Location "devhub-be-main-service"
        npm install
        Set-Location ".."
        
        Write-Host "Todo Service..." -ForegroundColor Yellow
        Set-Location "devhub-be-todo-service"
        npm install
        Set-Location ".."
        
        Write-Host "Notes Service..." -ForegroundColor Yellow
        Set-Location "devhub-be-notes-service"
        npm install
        Set-Location ".."
        
        Write-Host "CV Service..." -ForegroundColor Yellow
        Set-Location "devhub-be-cv-service"
        go mod download
        Set-Location ".."
        
        Write-Host "AI Service..." -ForegroundColor Yellow
        Set-Location "devhub-be-ai-service"
        pip install -r requirements.txt
        Set-Location ".."
        
        Write-Host ""
        Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    }
    
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Setup complete! Happy coding!" -ForegroundColor Green
Write-Host ""
