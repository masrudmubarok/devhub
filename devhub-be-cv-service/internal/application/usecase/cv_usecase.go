package usecase

import (
	"devhub-cv-service/internal/domain"
	"devhub-cv-service/internal/application/dto"
	"errors"
	"time"
)

type CVUseCase struct {
	cvRepo domain.CVRepository
}

func NewCVUseCase(cvRepo domain.CVRepository) *CVUseCase {
	return &CVUseCase{cvRepo: cvRepo}
}

func (uc *CVUseCase) GetAllCVs(userID int) ([]dto.CVResponse, error) {
	cvs, err := uc.cvRepo.FindAll(userID)
	if err != nil {
		return nil, err
	}

	var response []dto.CVResponse
	for _, cv := range cvs {
		response = append(response, dto.CVResponse{
			ID:                  cv.ID,
			UserID:              cv.UserID,
			FullName:            cv.FullName,
			Email:               cv.Email,
			Phone:               cv.Phone,
			Location:            cv.Location,
			ProfessionalSummary: cv.ProfessionalSummary,
			Template:            cv.Template,
			CreatedAt:           cv.CreatedAt.Format(time.RFC3339),
			UpdatedAt:           cv.UpdatedAt.Format(time.RFC3339),
		})
	}

	return response, nil
}

func (uc *CVUseCase) GetCVByID(id, userID int) (*dto.CVResponse, error) {
	cv, err := uc.cvRepo.FindByID(id, userID)
	if err != nil {
		return nil, err
	}
	if cv == nil {
		return nil, errors.New("CV not found")
	}

	return &dto.CVResponse{
		ID:                  cv.ID,
		UserID:              cv.UserID,
		FullName:            cv.FullName,
		Email:               cv.Email,
		Phone:               cv.Phone,
		Location:            cv.Location,
		ProfessionalSummary: cv.ProfessionalSummary,
		Template:            cv.Template,
		CreatedAt:           cv.CreatedAt.Format(time.RFC3339),
		UpdatedAt:           cv.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (uc *CVUseCase) CreateCV(req dto.CreateCVRequest) (*dto.CVResponse, error) {
	cv := &domain.CV{
		UserID:              req.UserID,
		FullName:            req.FullName,
		Email:               req.Email,
		Phone:               req.Phone,
		Location:            req.Location,
		ProfessionalSummary: req.ProfessionalSummary,
		Template:            req.Template,
	}

	if cv.Template == "" {
		cv.Template = "modern"
	}

	err := uc.cvRepo.Create(cv)
	if err != nil {
		return nil, err
	}

	return uc.GetCVByID(cv.ID, cv.UserID)
}

func (uc *CVUseCase) UpdateCV(id, userID int, req dto.UpdateCVRequest) (*dto.CVResponse, error) {
	existing, err := uc.cvRepo.FindByID(id, userID)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, errors.New("CV not found")
	}

	cv := &domain.CV{
		ID:                  id,
		UserID:              userID,
		FullName:            req.FullName,
		Email:               req.Email,
		Phone:               req.Phone,
		Location:            req.Location,
		ProfessionalSummary: req.ProfessionalSummary,
		Template:            req.Template,
	}

	err = uc.cvRepo.Update(id, userID, cv)
	if err != nil {
		return nil, err
	}

	return uc.GetCVByID(id, userID)
}

func (uc *CVUseCase) DeleteCV(id, userID int) error {
	existing, err := uc.cvRepo.FindByID(id, userID)
	if err != nil {
		return err
	}
	if existing == nil {
		return errors.New("CV not found")
	}

	return uc.cvRepo.Delete(id, userID)
}
