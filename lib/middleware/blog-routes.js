var routes = require('../../routes'),
	user = require('../../routes/user'),
	path = require('path');
module.exports = function(app, config){
	app.get('/', routes.index);
	app.get('/users', user.list);
	app.get('/signup', user.signup);
	app.post('/signup', user.post);
	app.get('/login', user.login);
}