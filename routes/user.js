
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.signup = function(req, res){
	res.render('signup', { title: 'Sign up page' });
};

exports.post = function(req, res){
    res.redirect(301, '/login');
}

exports.login = function(req, res){
    res.send(200);
}