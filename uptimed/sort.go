package uptimed

type BySince Records

func (a BySince) Len() int           { return len(a) }
func (a BySince) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a BySince) Less(i, j int) bool { return a[i].Since < a[j].Since }
