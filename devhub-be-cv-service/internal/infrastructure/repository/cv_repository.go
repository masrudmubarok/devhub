package repository

import (
	"database/sql"
	"devhub-cv-service/internal/domain"
	"github.com/lib/pq"
	"time"
)

type PostgresCVRepository struct {
	db *sql.DB
}

func NewPostgresCVRepository(db *sql.DB) *PostgresCVRepository {
	return &PostgresCVRepository{db: db}
}

func (r *PostgresCVRepository) FindAll(userID int) ([]domain.CV, error) {
	query := `
		SELECT id, user_id, full_name, email, phone, location, 
		       professional_summary, template, created_at, updated_at
		FROM cvs
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cvs []domain.CV
	for rows.Next() {
		var cv domain.CV
		err := rows.Scan(
			&cv.ID, &cv.UserID, &cv.FullName, &cv.Email, &cv.Phone,
			&cv.Location, &cv.ProfessionalSummary, &cv.Template,
			&cv.CreatedAt, &cv.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		cvs = append(cvs, cv)
	}

	return cvs, nil
}

func (r *PostgresCVRepository) FindByID(id, userID int) (*domain.CV, error) {
	query := `
		SELECT id, user_id, full_name, email, phone, location,
		       professional_summary, template, created_at, updated_at
		FROM cvs
		WHERE id = $1 AND user_id = $2
	`

	var cv domain.CV
	err := r.db.QueryRow(query, id, userID).Scan(
		&cv.ID, &cv.UserID, &cv.FullName, &cv.Email, &cv.Phone,
		&cv.Location, &cv.ProfessionalSummary, &cv.Template,
		&cv.CreatedAt, &cv.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &cv, nil
}

func (r *PostgresCVRepository) Create(cv *domain.CV) error {
	query := `
		INSERT INTO cvs (user_id, full_name, email, phone, location, 
		                 professional_summary, template, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`

	now := time.Now()
	cv.CreatedAt = now
	cv.UpdatedAt = now

	return r.db.QueryRow(
		query, cv.UserID, cv.FullName, cv.Email, cv.Phone, cv.Location,
		cv.ProfessionalSummary, cv.Template, cv.CreatedAt, cv.UpdatedAt,
	).Scan(&cv.ID)
}

func (r *PostgresCVRepository) Update(id, userID int, cv *domain.CV) error {
	query := `
		UPDATE cvs
		SET full_name = $1, email = $2, phone = $3, location = $4,
		    professional_summary = $5, template = $6, updated_at = $7
		WHERE id = $8 AND user_id = $9
	`

	cv.UpdatedAt = time.Now()

	result, err := r.db.Exec(
		query, cv.FullName, cv.Email, cv.Phone, cv.Location,
		cv.ProfessionalSummary, cv.Template, cv.UpdatedAt, id, userID,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *PostgresCVRepository) Delete(id, userID int) error {
	query := `DELETE FROM cvs WHERE id = $1 AND user_id = $2`

	result, err := r.db.Exec(query, id, userID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// Skills Repository
type PostgresSkillsRepository struct {
	db *sql.DB
}

func NewPostgresSkillsRepository(db *sql.DB) *PostgresSkillsRepository {
	return &PostgresSkillsRepository{db: db}
}

func (r *PostgresSkillsRepository) FindByCV(cvID int) ([]domain.Skills, error) {
	query := `
		SELECT id, cv_id, category, skills, created_at
		FROM cv_skills
		WHERE cv_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query, cvID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var skills []domain.Skills
	for rows.Next() {
		var s domain.Skills
		err := rows.Scan(&s.ID, &s.CVID, &s.Category, pq.Array(&s.Skills), &s.CreatedAt)
		if err != nil {
			return nil, err
		}
		skills = append(skills, s)
	}

	return skills, nil
}

func (r *PostgresSkillsRepository) Create(skills *domain.Skills) error {
	query := `
		INSERT INTO cv_skills (cv_id, category, skills, created_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`

	skills.CreatedAt = time.Now()

	return r.db.QueryRow(
		query, skills.CVID, skills.Category, pq.Array(skills.Skills), skills.CreatedAt,
	).Scan(&skills.ID)
}

func (r *PostgresSkillsRepository) Update(id int, skills *domain.Skills) error {
	query := `
		UPDATE cv_skills
		SET category = $1, skills = $2
		WHERE id = $3
	`

	result, err := r.db.Exec(query, skills.Category, pq.Array(skills.Skills), id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *PostgresSkillsRepository) Delete(id int) error {
	query := `DELETE FROM cv_skills WHERE id = $1`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}
