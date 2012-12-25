var querystring = require('querystring');

function PostsService(pUoW, pHashMgr){
    var uow = pUoW,    
        hashMgr = pHashMgr,
        createEntry = function(entryData, cb){
            var postEntry = entryData,
                arrOfTags = postEntry.tags.replace(/\s+?/g,'').split(','),
                permalink = hashMgr.getHash(postEntry.title),
                escapedTitle = querystring.escape(postEntry.title);
            
            postEntry.title = escapedTitle;
            postEntry.date = new Date();
            postEntry.permalink = permalink;
            postEntry.comments = [];
            postEntry.tags = arrOfTags;
                
            uow.posts().insert(postEntry, cb);
        },
        getByPermalink = function(permalink, cb){
            uow.posts().findOne({'permalink' : permalink}, cb)
        },
        getTopPosts = function(cb){
            uow.posts().find({}, {sort : {date : -1}, limit : 10}, cb);
        },
        addCommentToPost = function(permalink, comment, cb){
            uow.posts().update({'permalink' : permalink}, { $push : { 'comments' : comment } }, {}, cb);
        },
        addLikeToComment = function(permalink, ordinal, cb){
            var likeIncQuery = {},
                propNameCommentWithOrdinal = 'comments.' + ordinal + '.likes';
                
            likeIncQuery[propNameCommentWithOrdinal] = 1;
            
            uow.posts().findAndModify({ permalink : permalink,  comments : { $not : { $size : 0 }} }, [], 
                                        { $inc : likeIncQuery }, 
                                        {new : true}, function(err, doc){
                                            if(err){
                                               cb(err);
                                            }else{
                                               cb(err, doc.comments[ordinal].likes);
                                            }
                                        });
        };
    
    return {
        createEntry : createEntry,
        getByPermalink : getByPermalink,
        getTopPosts: getTopPosts,
        addCommentToPost : addCommentToPost,
        addLikeToComment : addLikeToComment
    }
}

exports.PostsService = PostsService;