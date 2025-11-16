package dto

type CreateCVRequest struct {
	UserID              int    `json:"user_id" validate:"required"`
	FullName            string `json:"full_name" validate:"required"`
	Email               string `json:"email" validate:"required,email"`
	Phone               string `json:"phone"`
	Location            string `json:"location"`
	ProfessionalSummary string `json:"professional_summary"`
	Template            string `json:"template"`
}

type UpdateCVRequest struct {
	FullName            string `json:"full_name"`
	Email               string `json:"email" validate:"omitempty,email"`
	Phone               string `json:"phone"`
	Location            string `json:"location"`
	ProfessionalSummary string `json:"professional_summary"`
	Template            string `json:"template"`
}

type CVResponse struct {
	ID                  int    `json:"id"`
	UserID              int    `json:"user_id"`
	FullName            string `json:"full_name"`
	Email               string `json:"email"`
	Phone               string `json:"phone"`
	Location            string `json:"location"`
	ProfessionalSummary string `json:"professional_summary"`
	Template            string `json:"template"`
	CreatedAt           string `json:"created_at"`
	UpdatedAt           string `json:"updated_at"`
}

type AIEnhanceRequest struct {
	Action  string `json:"action" validate:"required"`
	Content string `json:"content" validate:"required"`
	CVID    int    `json:"cv_id"`
}

type AIEnhanceResponse struct {
	Result string `json:"result"`
	Action string `json:"action"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}
