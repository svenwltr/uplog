package uptimed

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"

	logging "github.com/op/go-logging"
)

const UPRECORD_PATH = "/var/spool/uptimed/records"

var log *logging.Logger = logging.MustGetLogger("uplog.uptimed")

type Records []*Record

type Record struct {
	Uptime int    `json:"uptime"`
	Since  int    `json:"since"`
	Kernel string `json:"kernel"`
}

func parseRecord(line string) (*Record, error) {
	cols := strings.SplitN(line, ":", 3)

	if len(cols) != 3 {
		return nil, fmt.Errorf("Couldn't split '%s' correctly.", line)
	}

	uptime, err := strconv.Atoi(cols[0])
	if err != nil {
		return nil, err
	}

	since, err := strconv.Atoi(cols[1])
	if err != nil {
		return nil, err
	}

	kernel := cols[2]

	record := Record{uptime, since, kernel}
	return &record, nil

}

func GetRecords() (*Records, error) {
	file, err := os.Open(UPRECORD_PATH)
	if err != nil {
		return nil, err
	}

	var records Records = make(Records, 0)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		record, err := parseRecord(scanner.Text())
		if err != nil {
			return nil, err
		}
		records = append(records, record)
	}
	err = scanner.Err()
	if err != nil {
		return nil, err
	}

	return &records, nil

}
