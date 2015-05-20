package uptimed

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
)

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

	record := Record{uptime, since, kernel, 0, 0, 0, 0}
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

		var up float64 = float64(record.Uptime)

		if i == 0 {
			record.Trend = up
			record.Average = up
		} else {
			var prev *Record = records[i-1]
			record.Trend = prev.Trend*.8 + up*.2
			record.Average = (prev.Average*float64(i) + up) / float64(i+1)
		}
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
