var PostsService = require('../lib/services/posts.service').PostsService,    
    should = require('../node_modules/should'),
    mongodb = require('../node_modules/mongodb'),
    UoW = require('../lib/data/uow').UoW,
    MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    HashMgr = require("../lib/utils/hashmgr").HashMgr,
    mDbImport = new MdbUnit.Import(),
    mDbExport = new MdbUnit.Export(),
    Interface = require('../lib/interfaces/interface').jspatterns.contracts.Interface,
    IPostService = new Interface("IPostService", ["createPost"]),
    DB_NAME = "M101Test", 
    COL_POSTS = "posts",
    server = null,
    db = null,    
    postsService = null,
    hashMgr = new HashMgr('md5'),
    querystring = require('querystring'),
    TEST_POST_PERMALINK = 'f24bb941e34cff2fda983b56db603425',
    getPostEntry1 = function(){
            return  {
                        body : "Content content content",
                        author : "user1",
                        title : "User1 first post",
                        tags : "tag1, tag2, tag3"                
                    };
    };
    
function importPostsData(cb){
     mDbImport.setDb(DB_NAME)
              .setCollection(COL_POSTS)
              .setDrop(true)
              .importData("tests\\importData\\posts.json", 
                            function(code){
                                code.should.be.equal(0);
                                cb();
                            }
                         );
}


before(function(){
    server = new mongodb.Server("localhost", 27017, {auto_reconnect : true, poolSize : 4, socketOptions : {encoding : "utf-8"}});
	db = new mongodb.Db(DB_NAME, server, {safe: true});
	db.on("close", function(error){
		console.log("--- connection closed successfully");
	});
    postsService = new PostsService(new UoW(db), hashMgr);
});

describe("posts service tests", function(){    
    it("should created sucessfully", function(){
        should.exist(postsService);
    });
    
    it("should create new post", function(done){
        importPostsData(function(){
            postsService.createEntry(getPostEntry1(), function(err, posts){
                should.not.exist(err);
                should.exist(posts);
                posts.should.have.lengthOf(1);
                done();
            });
        });
    });
    
    it("should return post entry by permalink", function(done){
        importPostsData(function(){
            postsService.getByPermalink(TEST_POST_PERMALINK, function(err, post){
                post.permalink.should.be.equal(TEST_POST_PERMALINK);
                done();
            });
        });
    });
    
    describe("Most newer posts get operations", function(){
        it("should return 10 most newer posts entries", function(done){
            importPostsData(function(){
                postsService.getTopPosts(function(err, posts){
                    posts.length.should.be.below(11);
                    done();
                });
            });
        });
        
        it("should return 10 newer posts with last post at a top", function(done){
             importPostsData(function(){
                postsService.getTopPosts(function(err, posts){
                    var topPostTitle = querystring.unescape(posts[0].title);
                    topPostTitle.should.be.equal('User1 post#11');
                    done();
                });
             });
        });
    });
    
    describe("Check for special field filling for post entry (date, tags, permalink and title)", function(){
        it("should create post entry with non empty and valid permalink", function(done){
            importPostsData(function(){                        
                postsService.createEntry(getPostEntry1(), function(err, posts){
                    should.not.exist(err);
                    var validPermalink = hashMgr.getHash(getPostEntry1().title),
                        post = posts[0];
                    post.permalink.should.equal(validPermalink);
                    done();
                });
            });
        });
        
        it("should create post with parsed string of tags to array of tags", function(done){
            importPostsData(function(){                        
                postsService.createEntry(getPostEntry1(), function(err, posts){
                    should.not.exist(err);
                    var validPermalink = hashMgr.getHash(getPostEntry1().title),
                        post = posts[0];
                    
                    post.tags.should.have.lengthOf(3);
                    done();
                });
            });
        });
        
        
        it("should create post with setting date field using current date and time", function(done){
            importPostsData(function(){                        
                postsService.createEntry(getPostEntry1(), function(err, posts){
                    should.not.exist(err);
                    var validPermalink = hashMgr.getHash(getPostEntry1().title),
                        post = posts[0];
                    
                    post.date.getDate().should.be.equal(15);
                    post.date.getYear().should.be.equal(112);
                    post.date.getMonth().should.be.equal(11);                    
                    done();
                });
            });
        });
        
        it("should create post with unescaped title", function(done){   
            importPostsData(function(){
                postsService.createEntry(getPostEntry1(), function(err, posts){
                    should.not.exist(err);
                        var escapedTitle = querystring.escape(getPostEntry1().title),
                        post = posts[0];
                    
                    post.title.should.equal(escapedTitle);
                    done();
                });
            });
        });
        
        it.skip("gen 11 posts and export", function(done){
            importPostsData(function(){
                var bodyOfPost = "Contrary to popular belief, Lorem Ipsum is not simply random text. \
It has roots in a piece of classical Latin literature from 45 BC, \
making it over 2000 years old. Richard McClintock, a Latin professor \
at Hampden-Sydney College in Virginia, looked up one of the more \
obscure Latin words, consectetur, from a Lorem Ipsum passage, and \
going through the cites of the word in classical literature, \
discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \
\"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC.\
This book is a treatise on the theory of ethics, very popular during the Renaissance. \
The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32."

                for(var i = 0; i< 11; i++){
                    var post = {
                                body : "Post#" + i + ": " + bodyOfPost,
                                author : "user1",
                                title : "User1 post#" + i,
                                tags : "tag" +(i+1)+ ", tag" + (i+2) + ", tag" + (i+3)
                              };
                    postsService.createEntry(post, function (){
                        console.log('.');                   
                    });
                }      
                mDbExport.setDb(DB_NAME).setCollection(COL_POSTS).exportData(".\\tests_outdir\\posts.json",function(exit_code){
                        should.exist(exit_code);
                        exit_code.should.be.equal(0);
                        done();
                });                
            });
        });
    });    
});