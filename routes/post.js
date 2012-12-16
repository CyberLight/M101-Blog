var services = require('../lib/data/services').services,
    isAuthenticated = false;

function checkAuthentication(req, res){
   isAuthenticated = req.signedCookies.username ? true : false;
}

function renderNewPostPage(req, res, post){
    var postEntity = post || { title : '', body : '', tags : '' };
    res.render('newpost', { title : "Create a new post", post : postEntity});
}

exports.newEntry = function(req, res){
    checkAuthentication(req, res);
    if(!isAuthenticated){
        res.redirect(301, '/login');
    }else{
        renderNewPostPage(req, res);
    }
    
}

exports.getViewEntry = function(req, res){
    res.send(200);
}

exports.postNewEntry = function(req, res){  
    console.log("POST_NEW_ENTRY");
    var username = req.signedCookies.username,
        postEntry = {
            title : req.body.post.title,
            body : req.body.post.body,
            author : username,
            tags : req.body.post.tags
        };
        
    services.getPostsService(function(err, ps){
        ps.createEntry(
            postEntry,
            function(err, posts){
                console.log(err);
                if(err){
                   renderNewPostPage(req, res, postEntry);
                }else{
                   console.log(posts[0].permalink);
                   var redirectUrl = '/post/' + posts[0].permalink + '/view';
                   res.redirect(201, redirectUrl);
                   res.redirect(redirectUrl);
                }               
            }
        );            
    });    
}