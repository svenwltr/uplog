package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path"

	logging "github.com/op/go-logging"

	"github.com/svenwltr/uplog/uptimed"
)

var log *logging.Logger = logging.MustGetLogger("uplog.http")

func loggedHandler(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Debug("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)

	})

}

type jsonHandlerFunc func() (interface{}, error)

func jsonHandler(fn jsonHandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		data, err := fn()
		if err != nil {
			log.Error(err.Error())
			w.WriteHeader(500)
			return
		}

		bytes, err := json.Marshal(data)
		if err != nil {
			log.Error(err.Error())
			w.WriteHeader(500)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(bytes)

	})

}

func Start(appRoot string, port int) {
	// handle static files
	var h http.Handler
	h = http.FileServer(http.Dir(path.Join(appRoot, "resources")))
	h = http.StripPrefix("/", h)
	h = loggedHandler(h)
	http.Handle("/", h)

	// handle full record list
	h = jsonHandler(func() (interface{}, error) { return uptimed.GetRecords() })
	h = loggedHandler(h)
	http.Handle("/api/records", h)

	// handle scores
	h = jsonHandler(func() (interface{}, error) { return uptimed.GetScore() })
	h = loggedHandler(h)
	http.Handle("/api/score", h)

	// handle stats
	h = jsonHandler(func() (interface{}, error) { return uptimed.GetStats() })
	h = loggedHandler(h)
	http.Handle("/api/stats", h)

	// start server
	listen := fmt.Sprintf(":%d", port)
	log.Info("Starting HTTP server on %s\n", listen)
	http.ListenAndServe(listen, nil)

}
