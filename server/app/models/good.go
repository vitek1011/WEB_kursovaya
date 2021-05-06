package models

import validation "github.com/go-ozzo/ozzo-validation/v4"

// Good is a model from db
type Good struct {
	ID          string `json:"id,omitempty"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	Image       Image  `json:"image"`
}

type Image struct {
	Name string `json:"name"`
	Url  string `json:"url"`
}

func (g *Good) Validate() error {
	return validation.ValidateStruct(
		g,
		validation.Field(&g.Name, validation.Required, validation.Length(3, 30)),
		validation.Field(&g.Description, validation.Required, validation.Length(3, 150)),
		validation.Field(&g.Price, validation.Required, validation.Min(1)),
	)
}
