# DevHub API Examples

## 🔧 Setup

**Service URLs (Direct Access):**
- Auth Service: `http://localhost:4000`
- Todo Service: `http://localhost:3001`
- Notes Service: `http://localhost:3002`
- CV Service: `http://localhost:3003`
- AI Service: `http://localhost:8000`

**Authentication:**
All examples require JWT token. Get token from Auth Service first.

```bash
# Login first to get JWT token
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Demo1234"}' \
  | jq -r '.accessToken')

# Use token in subsequent requests
echo $TOKEN
```

## 🔐 Auth Service

### Register User
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "Demo1234",
    "name": "Demo User"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "Demo1234"
  }' \
  -c cookies.txt

# Response:
# {
#   "message": "Login successful",
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expiresIn": "7d",
#   "user": { "id": 1, "email": "demo@example.com", ... }
# }
```

### Get Current User Profile
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:4000/auth/refresh \
  -b cookies.txt
```

### Admin - Health Check
```bash
curl -X GET http://localhost:4000/admin/health \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Admin - List Users
```bash
curl -X GET "http://localhost:4000/admin/users?limit=20&offset=0" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Admin - System Stats
```bash
curl -X GET http://localhost:4000/admin/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 📋 Todo Service

### Create Todo
```bash
curl -X POST http://localhost:3001/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "Build DevHub frontend",
    "description": "Create responsive UI with Next.js",
    "status": "in_progress",
    "priority": "high",
    "due_date": "2024-12-31"
  }'
```

### Get All Todos
```bash
curl http://localhost:3001/todos \
  -H "Authorization: Bearer $TOKEN"
```

### Update Todo
```bash
curl -X PUT http://localhost:3001/todos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Get Statistics
```bash
curl http://localhost:3001/todos/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Delete Todo
```bash
curl -X DELETE http://localhost:3001/todos/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 📝 Notes Service

### Create Note
```bash
curl -X POST http://localhost:3002/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "React Best Practices",
    "content": "Always use functional components with hooks...",
    "category": "documentation",
    "tags": ["react", "javascript", "frontend"]
  }'
```

### Get All Notes
```bash
curl http://localhost:3002/notes \
  -H "Authorization: Bearer $TOKEN"
```

### Search Notes
```bash
curl "http://localhost:3002/notes/search?query=react" \
  -H "Authorization: Bearer $TOKEN"
```

### AI Enhance - Summarize Note
```bash
curl -X POST http://localhost:3002/notes/ai-enhance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "summarize",
    "content": "React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of developers. React allows developers to create large web applications that can change data without reloading the page. The main purpose of React is to be fast, scalable, and simple."
  }'
```

### AI Enhance - Improve Note
```bash
curl -X POST http://localhost:3002/notes/ai-enhance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "improve",
    "content": "docker is good. use it for containers. makes deployment easy"
  }'
```

### AI Enhance - Generate Documentation
```bash
curl -X POST http://localhost:4000/api/notes/ai-enhance \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate_doc",
    "content": "function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }"
  }'
```

### Search Notes
```bash
curl "http://localhost:4000/api/notes/search?user_id=1&q=react"
```

### Create Code Snippet
```bash
curl -X POST http://localhost:4000/api/notes/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "React useState Hook",
    "language": "javascript",
    "code": "const [count, setCount] = useState(0);",
    "description": "Basic useState example"
  }'
```

## 📄 CV Service

### Create CV
```bash
curl -X POST http://localhost:4000/api/cv \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "full_name": "John Developer",
    "email": "john@example.com",
    "phone": "+62812345678",
    "location": "Jakarta, Indonesia",
    "professional_summary": "Experienced full-stack developer with 5 years of expertise",
    "template": "modern"
  }'
```

### Add Work Experience
```bash
curl -X POST http://localhost:4000/api/cv/1/experiences \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "Jakarta",
    "start_date": "2020-01-15",
    "end_date": null,
    "is_current": true,
    "description": [
      "Led development of microservices architecture",
      "Improved system performance by 40%",
      "Mentored 5 junior developers"
    ]
  }'
```

### AI Enhance - Rewrite Professional Summary
```bash
curl -X POST http://localhost:4000/api/cv/ai-enhance \
  -H "Content-Type: application/json" \
  -d '{
    "action": "rewrite_summary",
    "content": "I am a developer with some experience in web development. I know JavaScript and React.",
    "cv_id": 1
  }'
```

### AI Enhance - Improve Experience Bullets
```bash
curl -X POST http://localhost:4000/api/cv/ai-enhance \
  -H "Content-Type: application/json" \
  -d '{
    "action": "improve_experience",
    "content": "Made the website faster. Fixed bugs. Worked with team.",
    "cv_id": 1
  }'
```

### AI Enhance - Generate Skills
```bash
curl -X POST http://localhost:4000/api/cv/ai-enhance \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate_skills",
    "content": "Senior Software Engineer at Tech Corp. Led development of microservices with Node.js and React. Worked with AWS, Docker, and PostgreSQL.",
    "cv_id": 1
  }'
```

### AI Enhance - Translate CV
```bash
curl -X POST http://localhost:4000/api/cv/ai-enhance \
  -H "Content-Type: application/json" \
  -d '{
    "action": "translate",
    "content": "Experienced full-stack developer specializing in modern web technologies",
    "cv_id": 1
  }'
```

### Add Education
```bash
curl -X POST http://localhost:4000/api/cv/1/education \
  -H "Content-Type: application/json" \
  -d '{
    "degree": "Bachelor of Computer Science",
    "institution": "University of Technology",
    "location": "Jakarta",
    "start_date": "2015-08-01",
    "end_date": "2019-06-30",
    "gpa": "3.8",
    "description": "Focus on Software Engineering"
  }'
```

### Add Skills
```bash
curl -X POST http://localhost:4000/api/cv/1/skills \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Technical Skills",
    "skills": ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"]
  }'
```

### Add Project
```bash
curl -X POST http://localhost:4000/api/cv/1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "DevHub Platform",
    "description": "All-in-one developer productivity platform with microservices architecture",
    "technologies": ["Next.js", "NestJS", "Go", "FastAPI", "PostgreSQL"],
    "url": "https://github.com/username/devhub"
  }'
```

### Get CV with Full Details
```bash
curl "http://localhost:4000/api/cv/1?user_id=1"
```

## 🤖 Direct AI Service Calls

### Generate Tags for Note
```bash
curl -X POST http://localhost:8000/notes/generate-tags \
  -H "Content-Type: application/json" \
  -d '"React hooks tutorial for beginners"'
```

### Analyze CV
```bash
curl -X POST http://localhost:8000/cv/analyze \
  -H "Content-Type: application/json" \
  -d '"John Developer - Software Engineer with 5 years experience in React and Node.js"'
```

### General Text Generation
```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '"Write a professional email template for job application"'
```

## 🧪 Testing with Thunder Client / Postman

Import this collection to Thunder Client:

1. Create new request
2. Set base URL: `http://localhost:4000`
3. Add environment variable: `user_id = 1`
4. Use examples above

## 💡 Tips

- All `user_id` parameters are required for multi-tenancy
- AI features require valid `GEMINI_API_KEY` in `.env`
- Use `?user_id=1` in query params for GET requests
- Use `"user_id": 1` in request body for POST requests
