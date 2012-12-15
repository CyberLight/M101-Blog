
/*
 * GET home page.
 */

var isAuthenticated = false,
    querystring = require('querystring'),
    services = require('../lib/data/services').services,
    DateFormatter = require('../lib/utils/date.format').DateFormatter,
    POST_BODY_PREVIEW_LEN = 337;

function checkAuthentication(req, res){
   isAuthenticated = req.signedCookies.username ? true : false;
}

function renderIndex(req, res){
    checkAuthentication(req, res);
    console.log('isAuthenticated : '+ isAuthenticated);
    services.getPostsService(function(err, postsService){
        postsService.getTopPosts(function(err, posts){
            posts.forEach(function(post){
                post.title = querystring.unescape(post.title).toUpperCase();
                post.viewlink = "/post/" + post.permalink + "/view";
                if(post.body.length > POST_BODY_PREVIEW_LEN)
                    post.body = post.body.substring(0, POST_BODY_PREVIEW_LEN-3) + "..."
                post.publishDate = DateFormatter.format(post.date, "mmm, dd yyyy");
            });
            res.render('index', { title: 'M101 Blog', user : { isAuthenticated : isAuthenticated, name : req.signedCookies.username }, posts : posts});
        });
    });
}
 
exports.index = function(req, res){
  renderIndex(req, res);
};

exports.logout = function(req, res){
    res.clearCookie('username');
    res.redirect(301, '/');
}