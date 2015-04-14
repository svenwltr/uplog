package main

import (
	"fmt"
	"os"

	logging "github.com/op/go-logging"
	"github.com/svenwltr/uplog/http"
)

var log *logging.Logger = logging.MustGetLogger("uplog")

var (
	// This should be replaced with ldflags
	// eg: `go build -ldflags "-X main.VERSION 0.1.2-abcd"`
	VERSION    = "UNKNOWN"
	BUILD_DATE = "UNKNOWN"
)

func main() {
	initLogger()
	printVersion()

	http.Start(Config.AppRoot, Config.Port)

}

// Prints current version. If -version flag is set then it is print to stdout,
// else to logger.
func printVersion() {
	v := fmt.Sprintf("Uplog version: %s, build date: %s", VERSION,
		BUILD_DATE)

	if Config.Version {
		fmt.Println(v)
		os.Exit(0)

	} else {
		log.Info(v)

	}

}

func initLogger() {
	var format = logging.MustStringFormatter(
		"%{color}%{time:15:04:05.000} %{module} ▶ %{level:.4s} %{id:05x}%{color:reset} %{message}",
	)

	var level logging.Level

	if Config.Verbose {
		level = logging.DEBUG
	} else {
		level = logging.INFO
	}

	backendPlain := logging.NewLogBackend(os.Stderr, "", 0)
	backendFormatter := logging.NewBackendFormatter(backendPlain, format)
	backendLeveled := logging.AddModuleLevel(backendFormatter)
	backendLeveled.SetLevel(level, "")

	logging.SetBackend(backendLeveled)

}
