package main

import "flag"

type CliConfig struct {
	Args    []string
	Version bool
	Verbose bool
	AppRoot string
	Port    int
}

var (
	defaults *CliConfig = &CliConfig{Version: false, Verbose: false,
		AppRoot: "./", Port: 8000}
)

var Config *CliConfig

func init() {
	var config *CliConfig = &CliConfig{}

	flag.BoolVar(&config.Version, "version", defaults.Version,
		"Prints current version and exits.")
	flag.BoolVar(&config.Verbose, "verbose", defaults.Verbose,
		"More logs!")
	flag.StringVar(&config.AppRoot, "app-root", defaults.AppRoot,
		"Specifies application root directory. (Contains static HTTP files.)")
	flag.IntVar(&config.Port, "port", defaults.Port,
		"Port for HTTP server.")

	flag.Parse()

	config.Args = flag.Args()

	Config = config

}
