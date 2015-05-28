package uptimed

func GetCharts() (charts *Charts, err error) {
	charts = new(Charts)

	charts.Time, err = GetTimeChart()
	if err != nil {
		return nil, err
	}

	charts.Density, err = GetDensityChart()
	if err != nil {
		return nil, err
	}

	return

}

func GetTimeChart() (data ChartData, err error) {
	var records Records

	records, err = GetRecords()
	if err != nil {
		return nil, err
	}

	data = make(ChartData)

	for _, r := range records {
		data = append(data, DataPoint{
			r.Since * 1000,
			r.Trend / 3600,
		})
	}

	return

}

func GetDensityChart() (data ChartData, err error) {
	return

}
