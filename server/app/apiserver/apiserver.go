package apiserver

import (
	"context"
	"net/http"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"github.com/ayoz4/go-next-web-app/app/store/firestoredb"
	"github.com/gorilla/sessions"
	"google.golang.org/api/option"
)

// Start - start the server
func Start(config *Config) error {
	client, err := connectToDb()
	if err != nil {
		return err
	}
	defer client.Close()

	store := firestoredb.New(client)
	sessionStore := sessions.NewCookieStore([]byte(config.SessionKey))
	srv := newServer(store, sessionStore)

	return http.ListenAndServe(config.Addr, srv)
}

// create connection to db`
func connectToDb() (*firestore.Client, error) {
	ctx := context.Background()
	sa := option.WithCredentialsFile("configs/newDb.json")
	app, err := firebase.NewApp(ctx, nil, sa)
	if err != nil {
		return nil, err
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		return nil, err
	}

	return client, err
}
