function secondOfDay(time) {
	return time % (24*3600);

}

function Record(record) {
	this.since = record.since;
	this.uptime = record.uptime;
	this.kernel = record.kernel;
	this.active = record.active;
	this.position = record.position;

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

