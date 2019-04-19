var worker, goBtn, textarea;

addEventListener('error', function(err) {
	var err_msg = err.message + ' (at ' + err.lineno + ':' + err.colno + ' in ' + err.filename + ')';
	textarea.value = err_msg;
});
addEventListener('DOMContentLoaded', function() {
	// Make sure workers work
	if('Worker' in window) {
		worker = new Worker('js/worker.js');
	} else {
		document.documentElement.classList.add('err_no_worker');
		return;
	}
	// Define things
	goBtn = document.querySelector('button#go');
	stopBtn = document.querySelector('button#stop');
	textarea = document.querySelector('textarea');
	// Add listeners and shit
	worker.addEventListener('message', function(e) {
		textarea.value = e.data.data;
	});
	goBtn.addEventListener('click', function() {
		if(worker)
			worker.postMessage({
				// Method to use
				'method': document.querySelector('select').selectedIndex,
				// Precision, let's say 500 digits
				'precision': 125,
				// Start and End value for N
				'start': 1,
				'end': 125,
				// Increment for N (only supported in `(1 + 1/n) ^ n` mode)
				'inc': 1,
				// How many ms per run
				'interval': 250
			});
	});
});