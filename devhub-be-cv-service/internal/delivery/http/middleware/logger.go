package middleware

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Logger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// Process request
		err := c.Next()

		// Log
		duration := time.Since(start)
		statusCode := c.Response().StatusCode()

		logMessage := fmt.Sprintf(
			"[%s] %s %s - %d - %v",
			start.Format("2006-01-02 15:04:05"),
			c.Method(),
			c.OriginalURL(),
			statusCode,
			duration,
		)

		if statusCode >= 400 {
			fmt.Println("❌", logMessage)
		} else {
			fmt.Println("✅", logMessage)
		}

		return err
	}
}
