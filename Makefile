
VERSION?=$(shell git describe --tags --dirty)
BUILD_DATE?=$(shell date -R)

export PATH := $(CURDIR)/node_modules/.bin:$(PATH)

GOXCARGS = -d="$(CURDIR)/dist" \
		   -resources-include="resources" \
		   -resources-exclude="*.go,.gitignore" \
		   -bc="linux,amd64" \
		   -pv=$(VERSION) \
		   -build-ldflags="-X main.VERSION $(VERSION) -X main.BUILD_DATE '$(BUILD_DATE)'"

all: bindeps assets compile

compile:
	go get -t -d -v ./...
	goxc $(GOXCARGS) validate compile
	goxc $(GOXCARGS) -tasks-=rmbin archive

bindeps:
	npm install \
		bower@1.3 \
		grunt@0.4 \
		grunt-cli@0.1.13 \
		grunt-processhtml@0.3.7

assets:
	echo '{"directory":"resources/assets"}' > .bowerrc
	bower install --force-latest \
		'd3#3.5.5' \
		'bootstrap#3' \
		'angular#1.4' \
		'angular-route#1.4' \
		'angular-i18n#1.4' \
		'angular-moment'

run:
	go run *.go
