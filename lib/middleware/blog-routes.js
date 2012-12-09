var routes = require('../../routes'),
    user = require('../../routes/user'),
    path = require('path');
module.exports = function(app, config){
    app.get('/', routes.index);    
    app.get('/logout', routes.logout);
    app.get('/users', user.list);
    app.get('/signup', user.signup);
    app.post('/signup', user.postSignUp);
    app.get('/login', user.login);
    app.post('/login', user.postLogin);
}