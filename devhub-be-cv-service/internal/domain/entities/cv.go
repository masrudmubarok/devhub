package domain

import "time"

type CV struct {
	ID                  int       `json:"id"`
	UserID              int       `json:"user_id"`
	FullName            string    `json:"full_name"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone"`
	Location            string    `json:"location"`
	ProfessionalSummary string    `json:"professional_summary"`
	Template            string    `json:"template"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

type Experience struct {
	ID          int       `json:"id"`
	CVID        int       `json:"cv_id"`
	Company     string    `json:"company"`
	Position    string    `json:"position"`
	StartDate   time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type Education struct {
	ID          int       `json:"id"`
	CVID        int       `json:"cv_id"`
	Institution string    `json:"institution"`
	Degree      string    `json:"degree"`
	FieldOfStudy string    `json:"field_of_study"`
	StartDate   time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	CreatedAt   time.Time `json:"created_at"`
}

type Skills struct {
	ID        int      `json:"id"`
	CVID      int      `json:"cv_id"`
	Category  string   `json:"category"`
	Skills    []string `json:"skills"`
	CreatedAt time.Time `json:"created_at"`
}

type Project struct {
	ID          int       `json:"id"`
	CVID        int       `json:"cv_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Technologies string    `json:"technologies"`
	URL         string    `json:"url"`
	CreatedAt   time.Time `json:"created_at"`
}
