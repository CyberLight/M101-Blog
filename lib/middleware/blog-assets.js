var express = require('../../node_modules/express'),
	lessMiddlware = require('../../node_modules/less-middleware')({ src: __dirname + '/../../public' }),
	path = require('path');

module.exports = function(app, config){	
	app.use(lessMiddlware);
	app.use(express.static(path.join(__dirname + '/../../', 'public')));
}