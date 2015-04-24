package uptimed

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	logging "github.com/op/go-logging"
)

const UPRECORD_PATH = "/var/spool/uptimed/records"

var log *logging.Logger = logging.MustGetLogger("uplog.uptimed")

type Records []*Record

type Record struct {
	Uptime   int64  `json:"uptime"`
	Since    int64  `json:"since"`
	Kernel   string `json:"kernel"`
	Position int    `json:"position"`
	Rank     int    `json:"rank"`
}

func parseRecord(line string) (*Record, error) {
	cols := strings.SplitN(line, ":", 3)

	if len(cols) != 3 {
		return nil, fmt.Errorf("Couldn't split '%s' correctly.", line)
	}

	uptime, err := strconv.ParseInt(cols[0], 10, 64)
	if err != nil {
		return nil, err
	}

	since, err := strconv.ParseInt(cols[1], 10, 64)
	if err != nil {
		return nil, err
	}

	kernel := cols[2]

	record := Record{uptime, since, kernel, 0, 0}
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

	// Set position.

	sort.Sort(BySince(records))
	for i, record := range records {
		record.Position = i + 1
	}

	// Update current uptime, since it is written every 10 minutes, only.
	var i int = len(records) - 1
	records[i].Uptime = time.Now().Unix() - records[i].Since

	// Set rank.
	sort.Sort(ByUptime(records))
	for i, record := range records {
		record.Rank = i + 1
	}

	return &records, nil

}
