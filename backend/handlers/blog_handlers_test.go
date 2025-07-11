package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthCheck(t *testing.T) {

	req, err := http.NewRequest("GET", "/health", nil) // health check handler/controller
	if err != nil {
		t.Fatal(err)
	}

	// record the response
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HealthCheck)

	handler.ServeHTTP(rr, req)

	// check status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	//  check if the body has the expected data
	expected := `"status":"healthy"`
	if rr.Body.String() == "" {
		t.Errorf("handler returned empty body")
	}
}
