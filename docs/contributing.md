# Contributing to DevHub

First off, thank you for considering contributing to DevHub! 🎉

## Code of Conduct

Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

### Suggesting Enhancements ✨

Enhancement suggestions are welcome! Please provide:

- **Clear use case**
- **Expected behavior**
- **Why this would be useful**
- **Possible implementation approach**

### Pull Requests 🚀

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Tests
   - `chore:` - Maintenance

5. **Push to your fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Add screenshots if UI changes

## Development Setup

### Prerequisites
- Node.js 20+
- Go 1.21+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+

### Local Setup
```bash
# Clone your fork
git clone https://github.com/your-username/devhub.git
cd devhub

# Setup environment
cp .env.example .env
# Add your Gemini API key to .env

# Run setup script
./setup.ps1
```

### Running Tests
```bash
# Frontend tests
cd devhub-fe-main-web
npm test

# Backend tests
cd devhub-be-todo-service
npm test
```

## Project Structure

```
devhub/
├── devhub-fe-main-web/          # Next.js frontend
├── devhub-be-main-service/      # Auth microservice (Express.js)
├── devhub-be-todo-service/      # Todo microservice (Nest.js)
├── devhub-be-notes-service/     # Notes microservice (Nest.js)
├── devhub-be-cv-service/        # CV microservice (Go Fiber)
├── devhub-be-ai-service/        # AI microservice (Python FastAPI)
└── database/                    # Database schemas
```

## Coding Standards

### TypeScript/JavaScript (Frontend & NestJS)
- Use TypeScript
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components
- Use async/await over promises

### Go (CV Service)
- Follow Go conventions
- Use `gofmt` for formatting
- Proper error handling
- Add comments for exported functions

### Python (AI Service)
- Follow PEP 8
- Use type hints
- Add docstrings
- Use Black for formatting

## Database Changes

When modifying database schema:

1. Update `database/init.sql`
2. Create migration (if needed)
3. Update TypeORM entities
4. Document changes in PR

## AI Integration

When adding AI features:

1. Add endpoint in `devhub-be-ai-service/main.py`
2. Create proper prompt engineering
3. Handle errors gracefully
4. Add rate limiting consideration
5. Document in API_EXAMPLES.md

## Documentation

Please update documentation when:

- Adding new features
- Changing API endpoints
- Modifying environment variables
- Updating dependencies
- Changing architecture

Files to update:
- `readme.md` - Main documentation
- `api_examples.md` - API usage examples
- `system_design.md` - Architecture details
- `quickstart.md` - Setup instructions

## Testing Guidelines

### Unit Tests
- Test individual functions
- Mock external dependencies
- Aim for 80%+ coverage

### Integration Tests
- Test API endpoints
- Test database operations
- Test service communication

### E2E Tests (Future)
- Test complete user flows
- Test across services

## Commit Messages

Good commit messages:
```
feat: add AI translation for CVs
fix: resolve todo deletion bug
docs: update API examples
style: format code with prettier
refactor: simplify notes service logic
test: add tests for CV service
chore: update dependencies
```

## Pull Request Checklist

Before submitting PR:

- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commits are clear and atomic
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] CI passes (if applicable)

## Getting Help

- **Issues**: GitHub Issues for bugs/features
- **Discussions**: GitHub Discussions for questions
- **Email**: [your-email@example.com]

## Recognition

Contributors will be added to:
- readme.md Contributors section
- changelog.md for their contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to DevHub! 🚀**

