package main

import (
	"fmt"

	logging "github.com/op/go-logging"
)

var log *logging.Logger = logging.MustGetLogger("uplog")

var (
	// This should be replaced with ldflags
	// eg: `go build -ldflags "-X main.VERSION 0.1.2-abcd"`
	VERSION    = "UNKNOWN"
	BUILD_DATE = "UNKNOWN"
)

func main() {
	v := fmt.Sprintf("Uplog version: %s, build date: %s", VERSION,
		BUILD_DATE)
	log.Info(v)

}
