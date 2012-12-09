
/*
 * GET home page.
 */

 var isAuthenticated = false;

function checkAuthentication(req, res){
   isAuthenticated = req.signedCookies.username ? true : false;
}

function renderIndex(req, res){
    checkAuthentication(req, res);
    console.log('isAuthenticated : '+ isAuthenticated);
    res.render('index', { title: 'M101 Blog', user : { isAuthenticated : isAuthenticated, name : req.signedCookies.username }});
}
 
exports.index = function(req, res){
  renderIndex(req, res);
};

exports.logout = function(req, res){
    res.clearCookie('username');
    res.redirect(301, '/');
}