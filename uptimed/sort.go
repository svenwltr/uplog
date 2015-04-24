package uptimed

type BySince Records

func (a BySince) Len() int           { return len(a) }
func (a BySince) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a BySince) Less(i, j int) bool { return a[i].Since < a[j].Since }

type ByUptime Records

func (a ByUptime) Len() int           { return len(a) }
func (a ByUptime) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByUptime) Less(i, j int) bool { return a[i].Uptime > a[j].Uptime }
