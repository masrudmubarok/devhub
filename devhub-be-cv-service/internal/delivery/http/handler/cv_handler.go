package handler

import (
	"devhub-cv-service/internal/application/dto"
	"devhub-cv-service/internal/application/usecase"
	"devhub-cv-service/internal/domain"
	"encoding/json"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type CVHandler struct {
	cvUseCase *usecase.CVUseCase
	aiService domain.AIService
}

func NewCVHandler(cvUseCase *usecase.CVUseCase, aiService domain.AIService) *CVHandler {
	return &CVHandler{
		cvUseCase: cvUseCase,
		aiService: aiService,
	}
}

func (h *CVHandler) GetAllCVs(c *fiber.Ctx) error {
	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid user_id",
		})
	}

	cvs, err := h.cvUseCase.GetAllCVs(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Internal Server Error",
			Message: err.Error(),
		})
	}

	return c.JSON(cvs)
}

func (h *CVHandler) GetCVByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid CV ID",
		})
	}

	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid user_id",
		})
	}

	cv, err := h.cvUseCase.GetCVByID(id, userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error:   "Not Found",
			Message: err.Error(),
		})
	}

	return c.JSON(cv)
}

func (h *CVHandler) CreateCV(c *fiber.Ctx) error {
	var req dto.CreateCVRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid request body",
		})
	}

	cv, err := h.cvUseCase.CreateCV(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Internal Server Error",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(cv)
}

func (h *CVHandler) UpdateCV(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid CV ID",
		})
	}

	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid user_id",
		})
	}

	var req dto.UpdateCVRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid request body",
		})
	}

	cv, err := h.cvUseCase.UpdateCV(id, userID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Internal Server Error",
			Message: err.Error(),
		})
	}

	return c.JSON(cv)
}

func (h *CVHandler) DeleteCV(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid CV ID",
		})
	}

	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid user_id",
		})
	}

	err = h.cvUseCase.DeleteCV(id, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error:   "Internal Server Error",
			Message: err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (h *CVHandler) EnhanceCV(c *fiber.Ctx) error {
	var req dto.AIEnhanceRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error:   "Bad Request",
			Message: "Invalid request body",
		})
	}

	result, err := h.aiService.EnhanceCV(req.Action, req.Content)
	if err != nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(dto.ErrorResponse{
			Error:   "Service Unavailable",
			Message: "AI service is temporarily unavailable",
		})
	}

	response := dto.AIEnhanceResponse{
		Result: result,
		Action: req.Action,
	}

	return c.JSON(response)
}
