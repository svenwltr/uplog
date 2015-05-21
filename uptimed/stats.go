package uptimed

import "sort"

func GetStats() (stats *Stats, err error) {
	var records *Records
	var yesterday *Record

	stats = new(Stats)

	stats.Score, err = GetScore()
	if err != nil {
		return nil, err
	}

	records, err = GetRecords()
	if err != nil {
		return nil, err
	}
	sort.Sort(BySince(*records))

	//stats.Today = (*records)[len(*records)-1]
	yesterday = (*records)[len(*records)-2]

	stats.Average = int64(yesterday.Average)
	stats.Trend = int64(yesterday.Trend)
	stats.Sum = 0
	for _, r := range *records {
		stats.Sum += r.Uptime
	}

	return

}
