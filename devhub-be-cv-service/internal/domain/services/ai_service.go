package domain

type AIService interface {
	EnhanceCV(action, content string) (string, error)
	AnalyzeCV(cvID int) (map[string]interface{}, error)
}
