package store

// Store is the interface for the repositories
type Store interface {
	Good() GoodRepository
}
