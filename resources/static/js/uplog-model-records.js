

function Records(data) {
	var self = this;
	var my = {
		curr: null,
		length: data.length,
		records: [],
		index: {
			position: {},
			rank: {},
		},
	};

	self.raw = my.records;

	data.forEach(function(data) {
		var record = new Record(data);
		my.records.push(record);
		my.index.position[record.position] = record;
		my.index.rank[record.rank] = record;

	});

	my.curr = my.records.reduce(function(best, curr) {
		return (best.position < curr.position)?curr:best;
	}, my.records[0]);

	/* public functions */

	self.inheritHashes = function(other) {
		// TODO
	}

	/* public functions: position */

	self.best = function() {
		return my.index.rank[1];
	};

	self.better = function(than) {
		return my.index.rank[than.rank-1];
	};

	self.active = function() {
		return my.curr
	};

	self.worse = function(than) {
		return my.index.rank[than.rank+1];
	};

	self.worst = function() {
		return my.index.rank[my.length];
	};

	/* public functions: stats */

	/*our.getSinceSlice = function(begin, end) {
		return orderedSlice('since').slice(begin, end);
	}

	our.getTotalUptime = function(begin, end) { 
		var a = our.getSinceSlice(begin, end);
		return a.reduce(function(sum, record) {
			return sum + record.uptime;
		}, 0);

	};

	our.getAverageUptime = function(begin, end) {
		var a = our.getSinceSlice(begin, end);
		var sum = a.reduce(function(sum, record) {
			return sum + record.uptime;
		}, 0);
		return Math.round(sum / a.length);

	}; */

};

