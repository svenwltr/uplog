package http

import (
	"fmt"
	"net/http"
	"path"

	logging "github.com/op/go-logging"
)

var log *logging.Logger = logging.MustGetLogger("uplog.http")

func handleFiles(url string, dir string) {
	http.Handle(url, Log(http.StripPrefix(
		url, http.FileServer(http.Dir(dir)))))

}

func Log(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Debug("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		handler.ServeHTTP(w, r)

	})

}

func Start(appRoot string, port int) {
	handleFiles("/assets/", path.Join(appRoot, "resources/assets"))
	handleFiles("/", path.Join(appRoot, "resources/static"))

	//http.HandleFunc("/rest/heartbeat", httpHeartbeatHandler)

	listen := fmt.Sprintf(":%d", port)
	log.Info("Starting HTTP server on %s\n", listen)
	http.ListenAndServe(listen, nil)

}
