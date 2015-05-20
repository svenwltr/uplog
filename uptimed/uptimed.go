package uptimed

import logging "github.com/op/go-logging"

const UPRECORD_PATH = "/var/spool/uptimed/records"

var log *logging.Logger = logging.MustGetLogger("uplog.uptimed")

type Records []*Record

type Record struct {
	Uptime   int64   `json:"uptime"`
	Since    int64   `json:"since"`
	Kernel   string  `json:"kernel"`
	Position int     `json:"position"`
	Rank     int     `json:"rank"`
	Trend    float64 `json:"trend"`
	Average  float64 `json:"average"`
}

type Score struct {
	Best  *Record `json:"best"`
	Next  *Record `json:"next"`
	Curr  *Record `json:"curr"`
	Prev  *Record `json:"prev"`
	Worst *Record `json:"worst"`
}
