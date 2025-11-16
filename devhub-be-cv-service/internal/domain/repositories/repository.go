package domain

type CVRepository interface {
	FindAll(userID int) ([]CV, error)
	FindByID(id, userID int) (*CV, error)
	Create(cv *CV) error
	Update(id, userID int, cv *CV) error
	Delete(id, userID int) error
}

type ExperienceRepository interface {
	FindByCV(cvID int) ([]Experience, error)
	Create(exp *Experience) error
	Update(id int, exp *Experience) error
	Delete(id int) error
}

type EducationRepository interface {
	FindByCV(cvID int) ([]Education, error)
	Create(edu *Education) error
	Update(id int, edu *Education) error
	Delete(id int) error
}

type SkillsRepository interface {
	FindByCV(cvID int) ([]Skills, error)
	Create(skills *Skills) error
	Update(id int, skills *Skills) error
	Delete(id int) error
}

type ProjectRepository interface {
	FindByCV(cvID int) ([]Project, error)
	Create(project *Project) error
	Update(id int, project *Project) error
	Delete(id int) error
}
