package service

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"
)

type HTTPAIService struct {
	baseURL string
	client  *http.Client
}

func NewHTTPAIService(baseURL string) *HTTPAIService {
	return &HTTPAIService{
		baseURL: baseURL,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (s *HTTPAIService) EnhanceCV(action, content string) (string, error) {
	requestBody, err := json.Marshal(map[string]string{
		"action":  action,
		"content": content,
	})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", s.baseURL+"/cv/enhance", bytes.NewBuffer(requestBody))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", errors.New("AI service returned error status")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	if res, ok := result["result"].(string); ok {
		return res, nil
	}

	return "", errors.New("invalid response from AI service")
}

func (s *HTTPAIService) AnalyzeCV(cvID int) (map[string]interface{}, error) {
	url := fmt.Sprintf("%s/cv/analyze", s.baseURL)
	
	requestBody, err := json.Marshal(map[string]int{
		"cv_id": cvID,
	})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return result, nil
}
