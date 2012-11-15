var routes = require('../../routes'),
	user = require('../../routes/user'),
	path = require('path');
module.exports = function(app, config){
	app.get('/', routes.index);
	app.get('/users', user.list);
}