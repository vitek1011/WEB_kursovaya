package apiserver

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/ayoz4/go-next-web-app/app/models"
	"github.com/ayoz4/go-next-web-app/app/store"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/sirupsen/logrus"
)

const (
	ctxKeyUser ctxKey = iota
)

var (
	sessionName         string
	errNotAuthenticated = errors.New("not authenticated")
)

type ctxKey int8

type server struct {
	router       *mux.Router
	logger       *logrus.Logger
	store        store.Store
	sessionStore sessions.Store
}

func newServer(store store.Store, sessionStore sessions.Store) *server {
	s := &server{
		router:       mux.NewRouter(),
		logger:       logrus.New(),
		store:        store,
		sessionStore: sessionStore,
	}

	s.configureRouter()

	return s
}

func (s *server) configureRouter() {
	s.router.Use(
		handlers.CORS(
			handlers.AllowedOrigins([]string{"http://localhost:3000"}),
			handlers.AllowCredentials(),
			handlers.AllowedMethods([]string{"POST", "GET", "OPTIONS", "DELETE", "PUT"})),
	)

	s.router.HandleFunc("/login", s.handleLogin()).Methods("POST")
	s.router.HandleFunc("/goods", s.handleGetGoods()).Methods("GET")
	s.router.HandleFunc("/goods/{id}", s.handleGetGood()).Methods("GET")

	private := s.router.PathPrefix("/private").Subrouter()
	// private.Use(s.authenticateUser)
	private.HandleFunc("/whoami", s.handleWhoami()).Methods("POST")
	// private.HandleFunc("/goods", s.handleCreateGood()).Methods("POST")
	private.HandleFunc("/goods/{id}", s.handleDeleteGood()).Methods("DELETE", "OPTIONS")
	private.HandleFunc("/goods", s.handleUpdateGood()).Methods("PUT", "OPTIONS")
	private.HandleFunc("/delsessions", s.handleLogout()).Methods("POST")
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

func (s *server) authenticateUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := s.sessionStore.Get(r, sessionName)
		if err != nil {
			s.error(w, r, http.StatusInternalServerError, err)
			return
		}

		new := session.IsNew
		if new {
			s.error(w, r, http.StatusUnauthorized, errNotAuthenticated)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (s *server) handleWhoami() http.HandlerFunc {
	type request struct {
		Username string `json:"username"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		req := &request{}

		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
			s.error(w, r, http.StatusUnauthorized, err)
			return
		}

		session, err := s.sessionStore.Get(r, req.Username)
		if err != nil {
			s.error(w, r, http.StatusInternalServerError, err)
			return
		}

		new := session.IsNew
		if new {
			s.error(w, r, http.StatusUnauthorized, errNotAuthenticated)
			return
		}

		s.respond(w, r, http.StatusOK, "authenticated")
	}
}

func (s *server) handleLogin() http.HandlerFunc {
	type reqres struct {
		Username string `json:"username"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		req := &reqres{}
		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		// sessionName = req.Username

		session, err := s.sessionStore.Get(r, req.Username)
		if err != nil {
			s.error(w, r, http.StatusInternalServerError, err)
			return
		}

		session.Values["username"] = req.Username

		session.Options = &sessions.Options{
			MaxAge: 1000,
			Secure: false,
		}

		err = s.sessionStore.Save(r, w, session)
		if err != nil {
			s.error(w, r, http.StatusInternalServerError, err)
			return
		}

		res := &reqres{
			Username: req.Username,
		}

		s.respond(w, r, http.StatusOK, res)
	}
}

func (s *server) handleLogout() http.HandlerFunc {
	type request struct {
		Username string `json:"username"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		req := &request{}

		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
			s.error(w, r, http.StatusBadGateway, err)
			return
		}

		session, err := s.sessionStore.Get(r, req.Username)
		if err != nil {
			s.error(w, r, http.StatusInternalServerError, err)
			return
		}

		new := session.IsNew
		if new {
			s.error(w, r, http.StatusUnauthorized, errNotAuthenticated)
			return
		}

		session.Options = &sessions.Options{
			MaxAge: -1,
			Secure: false,
		}

		if err := s.sessionStore.Save(r, w, session); err != nil {
			s.error(w, r, http.StatusInternalServerError, err)
			return
		}

		s.respond(w, r, http.StatusOK, req.Username)
	}
}

func (s *server) handleGetGoods() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query().Get("filter")
		fmt.Println(q)

		goods := s.store.Good().GetGoods(q)

		if len(goods) < 0 {
			s.error(w, r, http.StatusNotFound, nil)
			return
		}

		s.respond(w, r, http.StatusOK, goods)
	}
}

func (s *server) handleGetGood() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		gID := vars["id"]

		g, err := s.store.Good().GetGood(gID)
		if err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, g)
	}
}

// func (s *server) handleCreateGood() http.HandlerFunc {
// 	type request struct {
// 		Name        string `json:"name"`
// 		Description string `json:"description"`
// 		Price       int    `json:"price"`
// 	}

// 	return func(w http.ResponseWriter, r *http.Request) {
// 		req := &request{}
// 		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
// 			s.error(w, r, http.StatusBadRequest, err)
// 			return
// 		}

// 		g := &models.Good{
// 			Name:        req.Name,
// 			Description: req.Description,
// 			Price:       req.Price,
// 		}
// 		if err := s.store.Good().CreateGood(g); err != nil {
// 			s.error(w, r, http.StatusUnprocessableEntity, err)
// 			return
// 		}

// 		s.respond(w, r, http.StatusCreated, g)
// 	}
// }

// func (s *server) handleCreateGood() http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		err := r.ParseMultipartForm(128 * 1024)
// 		if err != nil {
// 			s.error(w, r, http.StatusBadRequest, err)
// 			return
// 		}

// 		name := r.FormValue("name")
// 		fmt.Println(name)

// 		}

// 		price, err := strconv.Atoi(r.FormValue("price"))
// 		if err != nil {
// 			s.error(w, r, http.StatusBadRequest, err)
// 		}

// 		g := &models.Good{
// 			Name:        r.FormValue("name"),
// 			Description: r.FormValue("description"),
// 			Price:       price,
// 			File:        *f,
// 		}

// 		if err := s.store.Good().CreateGood(g); err != nil {
// 			s.error(w, r, http.StatusUnprocessableEntity, err)
// 			return
// 		}

// 		s.respond(w, r, http.StatusCreated, g)

// 		// fmt.Println(mh.Filename)
// 	}
// }

func (s *server) handleDeleteGood() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		gID := vars["id"]

		if err := s.store.Good().DeleteGood(gID); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, gID)
	}
}

func (s *server) handleUpdateGood() http.HandlerFunc {
	type request struct {
		ID          string       `json:"id"`
		Name        string       `json:"name"`
		Description string       `json:"description"`
		Price       int          `json:"price"`
		Image       models.Image `json:"image"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		req := &request{}
		if err := json.NewDecoder(r.Body).Decode(req); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		g := &models.Good{
			ID:          req.ID,
			Name:        req.Name,
			Description: req.Description,
			Price:       req.Price,
			Image:       req.Image,
		}

		if err := s.store.Good().UpdateGood(g); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, g.ID)
	}
}

// error is a function to send errors to client
func (s *server) error(w http.ResponseWriter, r *http.Request, code int, err error) {
	s.respond(w, r, code, map[string]string{"error": err.Error()})
}

// respond is a function to send response from server to client
func (s *server) respond(w http.ResponseWriter, r *http.Request, code int, data interface{}) {
	w.WriteHeader(code)
	if data != nil {
		json.NewEncoder(w).Encode(data)
	}
}
