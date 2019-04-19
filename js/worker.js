self.importScripts('ext/big.min.js');

self.factorials = {};
self.factorial = function(n) {
	if(n < 1)
		return Big(1);
	if(n in self.factorials)
		return self.factorials[n];
	var ret = Big(n);
	for(var i = n - 1; i > 0; i--) {
		if(i in self.factorials) {
			ret = ret.times(self.factorials[i]);
			break;
		}
		ret = ret.times(i);
	}
	self.factorials[n] = ret;
	return ret;
};

self.addEventListener('message', function(e) {
	switch(e.data.method || 0) {
		case 0:
			Big.DP = e.data.precision + 1;
			var n = e.data.start || 1,
				maxN = e.data.end || 100,
				i = setInterval(function() {
					postMessage({
						'method': e.data.method,
						'iterations': n,
						'data': (n >= maxN ? 'Complete!' : ('Iteration:' + n)) + '\n' + 
								Big(1).add(Big(1).div(n)).pow(n).toFixed(e.data.precision)
					});
					n += (e.data.inc || 1);
					if(n > maxN) {
						clearInterval(i);
						return;
					};
				}, e.data.interval || 10);
			break;
		case 1:
			Big.DP = e.data.precision + 1;
			var E = Big(1),
				n = e.data.start || 0,
				maxN = e.data.end || 100,
				i = setInterval(function() {
					E = E.add(Big(1).div(self.factorial(n)));
					postMessage({
						'method': e.data.method,
						'iterations': n,
						'data': (n >= maxN ? 'Complete!' : ('Iteration:' + n)) + '\n' + 
								E.toFixed(e.data.precision)
					});
					if(++n > maxN) {
						clearInterval(i);
						return;
					};
				}, e.data.interval || 10);
			break;
	};
});