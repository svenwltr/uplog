package uptimed

func GetScore() (score *Score, err error) {
	var records *Records
	var index map[int]*Record

	records, err = GetRecords()
	index = make(map[int]*Record)
	score = new(Score)

	for _, r := range *records {
		index[r.Rank] = r
		if score.Curr == nil || r.Since > score.Curr.Since {
			score.Curr = r
		}
	}

	score.Best = index[1]
	score.Worst = index[len(*records)]
	score.Prev = index[score.Curr.Rank+1]
	score.Next = index[score.Curr.Rank-1]

	return

}
