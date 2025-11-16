package main

import (
	"devhub-cv-service/internal/application/usecase"
	"devhub-cv-service/internal/delivery/http/handler"
	"devhub-cv-service/internal/delivery/http/middleware"
	"devhub-cv-service/internal/infrastructure/config"
	"devhub-cv-service/internal/infrastructure/repository"
	"devhub-cv-service/internal/infrastructure/service"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	db, err := config.InitDatabase(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Initialize repositories
	cvRepo := repository.NewPostgresCVRepository(db)
	skillsRepo := repository.NewPostgresSkillsRepository(db)

	// Initialize services
	aiService := service.NewHTTPAIService(cfg.AIServiceURL)

	// Initialize use cases
	cvUseCase := usecase.NewCVUseCase(cvRepo)

	// Initialize handlers
	cvHandler := handler.NewCVHandler(cvUseCase, aiService)

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.ErrorHandler,
		AppName:      "DevHub CV Service",
	})

	// Middlewares
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Use(middleware.Logger())

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"service": "cv-service",
		})
	})

	// API routes
	api := app.Group("/api")
	cv := api.Group("/cv")

	cv.Get("/", cvHandler.GetAllCVs)
	cv.Get("/:id", cvHandler.GetCVByID)
	cv.Post("/", cvHandler.CreateCV)
	cv.Put("/:id", cvHandler.UpdateCV)
	cv.Delete("/:id", cvHandler.DeleteCV)
	cv.Post("/ai-enhance", cvHandler.EnhanceCV)

	// Start server
	port := cfg.Port
	log.Printf("🚀 CV Service running on port %s\n", port)
	log.Printf("Environment: %s\n", getEnv("ENV", "development"))
	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
}

func getEnv(key, defaultValue string) string {
	return defaultValue
}
