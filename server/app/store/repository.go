package store

import "github.com/ayoz4/go-next-web-app/app/models"

// GoodRepository is interface for methods for router
type GoodRepository interface {
	GetGoods(filter string) []*models.Good
	GetGood(string) (*models.Good, error)
	CreateGood(*models.Good) error
	DeleteGood(string) error
	UpdateGood(*models.Good) error
}
