package domain

type Role struct {
	ID          string `json:"id"`
	Slug        string `json:"slug"`
	Name        string `json:"name"`
	ShortName   string `json:"shortName"`
	Description string `json:"description"`
}

type Application struct {
	ID            string   `json:"id"`
	ApplicantName string   `json:"applicantName"`
	Role          string   `json:"role"`
	RoleSlug      string   `json:"roleSlug"`
	Status        string   `json:"status"`
	SubmittedAt   string   `json:"submittedAt"`
	Summary       string   `json:"summary"`
	Skills        []string `json:"skills,omitempty"`
	Score         int      `json:"score,omitempty"`
}

type Task struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Status    string `json:"status"`
	Stage     string `json:"stage"`
	UpdatedAt string `json:"updatedAt"`
}

type Dashboard struct {
	PendingReview      int           `json:"pendingReview"`
	Processing         int           `json:"processing"`
	Failed             int           `json:"failed"`
	NewThisWeek        int           `json:"newThisWeek"`
	RecentApplications []Application `json:"recentApplications"`
	Tasks              []Task        `json:"tasks"`
}
