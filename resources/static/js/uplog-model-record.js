function secondOfDay(time) {
	return time % (24*3600);

}

function Record(record) {
	this.kernel = record.kernel;
	this.position = record.position;
	this.rank = record.rank;
	this.since = record.since;
	this.uptime = record.uptime;
	this.trend = record.trend;
	this.average = record.average;

}

Record.prototype.begin = function() {
	return this.since

}

Record.prototype.end = function() {
	return this.since + this.uptime;

}

Record.prototype.beginSOD = function() {
	return secondOfDay(this.begin());
}

Record.prototype.endSOD = function() {
	return secondOfDay(this.end());
}

