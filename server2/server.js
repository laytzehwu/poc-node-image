'use strict';

const express = require('express');


module.exports = (PORT) => {
	// Constants
	const HOST = '0.0.0.0';

	// App
	const app = express();
	app.get('/', (req, res) => {
	  res.send('Hello Ah Lay\n');
	});

	//app.listen(PORT, HOST);
	app.listen(PORT);
	console.log(`Running on port:${PORT}`);
}