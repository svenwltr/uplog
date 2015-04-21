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

func handleFiles(url string, dir string) {
	http.Handle(url, logged(http.StripPrefix(
		url, http.FileServer(http.Dir(dir)))))

}

func logged(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Debug("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)

	})

}

func recordHandler(w http.ResponseWriter, r *http.Request) {
	log.Debug("%s %s %s", r.RemoteAddr, r.Method, r.URL)
	records, err := uptimed.GetRecords()
	if err != nil {
		log.Error(err.Error())
		w.WriteHeader(500)
	}

	bytes, err := json.Marshal(records)
	if err != nil {
		log.Error(err.Error())
		w.WriteHeader(500)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)

}

func lastRecordHandler(w http.ResponseWriter, r *http.Request) {
	log.Debug("%s %s %s", r.RemoteAddr, r.Method, r.URL)
	records, err := uptimed.GetLastRecord()
	if err != nil {
		log.Error(err.Error())
		w.WriteHeader(500)
	}

	bytes, err := json.Marshal(records)
	if err != nil {
		log.Error(err.Error())
		w.WriteHeader(500)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)

}

func Start(appRoot string, port int) {
	handleFiles("/assets/", path.Join(appRoot, "resources/assets"))
	handleFiles("/", path.Join(appRoot, "resources/static"))

	http.HandleFunc("/api/records/last", lastRecordHandler)
	http.HandleFunc("/api/records", recordHandler)

	listen := fmt.Sprintf(":%d", port)
	log.Info("Starting HTTP server on %s\n", listen)
	http.ListenAndServe(listen, nil)

}
