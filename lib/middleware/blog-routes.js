var routes = require('../../routes'),
    user = require('../../routes/user'),
    post = require('../../routes/post'),
    path = require('path');
module.exports = function(app, config){
    app.get('/', routes.index);    
    app.get('/logout', routes.logout);
    app.get('/users', user.list);
    app.get('/signup', user.signup);
    app.post('/signup', user.postSignUp);
    app.get('/login', user.login);
    app.post('/login', user.postLogin);
    app.get('/post/new', post.newEntry);
    app.post('/post/new', post.postNewEntry);
    app.get('/post/:permalink/view', post.getViewEntry);
    app.post('/post/:permalink/addcomment', post.postNewComment);
}