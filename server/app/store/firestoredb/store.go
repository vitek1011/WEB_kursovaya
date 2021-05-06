package firestoredb

import (
	firestore "cloud.google.com/go/firestore"
	"github.com/ayoz4/go-next-web-app/app/store"
)

// Store is struct to save information about db connection and repository
type Store struct {
	client         *firestore.Client
	goodRepository *GoodRepository
}

// New is a function to initialize store
func New(client *firestore.Client) *Store {
	return &Store{
		client: client,
	}
}

// Good is a function to initialize good repository
func (s *Store) Good() store.GoodRepository {
	if s.goodRepository != nil {
		return s.goodRepository
	}

	s.goodRepository = &GoodRepository{
		store: s,
	}

	return s.goodRepository
}
