var services = require('../lib/data/services').services,
    querystring = require('querystring'),
    Utils = require('../lib/utils/utils').Utils;
    EMPTY_ERRORS = {"comment-author-error" : "", 
                   "comment-email-error" : "",
                   "comment-body-error" : "",
                   "success" : true };

function isAuthenticated(req, res){
   return req.signedCookies.username ? true : false;
}

function renderNewPostPage(req, res, post){
    var postEntity = post || { title : '', body : '', tags : '' };
    res.render('newpost', { title : "Create a new post", post : postEntity});
}

function renderViewPostPage(req, res, post, formCommentv){
    var postEntity = post || { title : 'empty title', body : 'empty body', tags : [] },
        tagsJoined = post.tags.length ? post.tags.join(', ') : '',
        formComment = formCommentv || { author : '', email : '', body : '', errors : EMPTY_ERRORS };  
    post.title = querystring.unescape(post.title).toUpperCase();
    post.stringOfTags = tagsJoined;
    post.comments.forEach(function(comment, index){
        if(!comment.token)
            comment.token = Utils.genGuid('') + index;
    });
    res.render('viewpost', { title : "View post page", post : postEntity, isAuthenticated : isAuthenticated(req, res), comment : formComment });
}

function renderPostViewWithCommentForm(req, res, comment){
     services.getPostsService(function(err, ps){
        ps.getByPermalink(req.params['permalink'], 
            function(err, post){
                renderViewPostPage(req, res, post, comment);
            }
        );
    });
}

function validateComment(comment){
    var validationRules = [],
        validationResult = [];
    
    validationRules.push(function(data){
        var result = {};
        result["success"] = new RegExp(/^[a-zA-Z0-9_-]{3,20}$/i).test(data.author);
        result["error"] = !result.success ? "invalid author of comment" : "";
        result["type"] = "comment-author-error";
        return result; 
    });
    
    validationRules.push(function(data){
        var result = {};
        result["success"] = new RegExp(/^[\w\s\S]{2,255}$/ig).test(data.body);
        result["error"] = !result.success ? "invalid body of comment" : "";
        result["type"] = "comment-body-error";
        return result; 
    })
    
    validationRules.push(function(data){
        var result = {};
        result["success"] = !data.email || new RegExp(/^[\S]+@[\S]+\.[\S]+$/i).test(data.email);
        result["error"] = !result.success ? "invalid email address" : "";
        result["type"] = "comment-email-error";
        return result; 
    })
    
    var success = true;
        
    for(var i=0, len=validationRules.length; i<len; i++){
        var result = validationRules[i](comment);
        validationResult[result.type] = result.error;
        success &= result.success;
    }    
    
    validationResult["success"] = success;
    return validationResult;
}

exports.newEntry = function(req, res){
    if(!isAuthenticated(req,res)){
        res.redirect(301, '/login');
    }else{
        renderNewPostPage(req, res);
    }
    
}

exports.getViewEntry = function(req, res){
    renderPostViewWithCommentForm(req, res);
}

exports.postNewEntry = function(req, res){
    if(isAuthenticated(req,res)){
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
                       res.redirect(redirectUrl);
                    }
                }
            );
        });
    }else{
        res.redirect('/login');
    }
}

exports.postNewComment = function(req, res){
    var permalink = req.params['permalink'],
        comment = null,
        validationResult = null;
        
    if(isAuthenticated(req, res)){
        comment = {
            author : req.signedCookies.username,
            body : req.body.comment.body
        };
    }else{
        comment = {
            author : req.body.comment.author,
            email : req.body.comment.email,
            body : req.body.comment.body
        };
    }
    
    validationResult = validateComment(comment);
    
    if(!validationResult.success){
        comment.errors = validationResult;
        renderPostViewWithCommentForm(req, res, comment);
    }else{
        comment.errors = EMPTY_ERRORS;
        services.getPostsService(function(err, ps){
            ps.addCommentToPost(permalink, comment, function(err, countUpdated){
               res.redirect(301, '/post/'+ permalink + '/view');
            });
        });
    }
};

exports.postAddLike = function(req, res){
    var permalink = req.params['permalink'],
        token = req.body.token;
    res.json({success : true, likes : 0});
}