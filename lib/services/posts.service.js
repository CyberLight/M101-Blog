var querystring = require('querystring');

function PostsService(pUoW, pHashMgr){
    var uow = pUoW,    
        hashMgr = pHashMgr,
        createEntry = function(entryData, cb){
            var postEntry = entryData,
                arrOfTags = postEntry.tags.replace(/\s+/i,'').split(','),
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
        };
    
    return {
        createEntry : createEntry,
        getByPermalink : getByPermalink,
        getTopPosts: getTopPosts
    }
}

exports.PostsService = PostsService;