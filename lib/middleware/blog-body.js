var express = require('../../node_modules/express');

module.exports = function(app, config) {
	console.log('dir name:' + __dirname);
	app.set('views', __dirname + '/../../views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser(config.session_secret));
	app.use(express.session());
	app.use(app.router);
}