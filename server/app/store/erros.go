package store

import "errors"

var (
	// ErrDocNotFound is an error when there is no document in db
	ErrDocNotFound = errors.New("document not found")
)
