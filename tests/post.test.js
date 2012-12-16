var mocha = require('../node_modules/mocha'),
	express = require('../node_modules/express'),
	should = require('../node_modules/should'),	
	superagent = require("../node_modules/superagent"),
	testUtils = require("../lib/shared/test.utils"),
    MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    mDbImport = new MdbUnit.Import(),
	cheerio = require('../node_modules/cheerio'),	
	agent = superagent.agent(),
	httpRootPath = 'http://localhost:3000',
    DB_NAME = "M101Test",
    COL_USERS = "users",
    COL_POSTS = "posts",
	TEST_POST_BODY = "It is a long established fact that a reader \
will be distracted by the readable content of a page when looking at its layout.\
 The point of using Lorem Ipsum is that it has a more-or-less normal distribution \
 of letters, as opposed to using 'Content here, content here', making it look like \
 readable English. Many desktop publishing packages and web page editors now use Lorem \
 Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many \
 web sites still in their infancy. Various versions have evolved over the years, \
 sometimes by accident, sometimes on purpose (injected humour and the like).",
    TestUser = {
         username : 'user1',
         password : 'password1'
    },
    TestPost1 = {
        title : 'My today post title #1',
        body : 'My today post #1:' + TEST_POST_BODY,
        tags : 'sun, smile, light'
    },
    TEST_POST_PERMALINK = '140f01bfd2f126e4d99128a6cf8e5d17';
    
function importUsersData(cb){
     mDbImport.setDb(DB_NAME).setCollection(COL_USERS).setDrop(true).importData("tests\\importData\\users.json", function(code){
        code.should.be.equal(0);
        cb();
    });
}

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

function goToNewPost(cb){
     agent.get(httpRootPath+"/post/new")
                     .end(cb);
}

function goToViewPostByPermalink(permalink, cb){
     agent.get(httpRootPath+"/post/" + permalink + '/view')
                     .end(cb);
}

function logError(err){
    if(err)
        console.log(err);
}

function login(username, password, cb){
    agent.post(httpRootPath+'/login')
                     .type('form')
                     .send({ user : 
                                { 
                                    username : username,
                                    password : password
                                }
                           })
                     .end(cb);
}

function logout(cb){
    agent.get(httpRootPath+'/logout')
                     .end(cb);
}

function postSignUpData(username, password, verify, email, cb){
    agent.post(httpRootPath+'/signup')
                     .type('form')
                     .send({ user : 
                                { 
                                    username : username,
                                    password : password,
                                    verify : verify,
                                    email : email
                                }
                           })
                     .end(cb);
}

function postEntryData(titlev, bodyv, tagsv, cb){
    agent.post(httpRootPath+'/post/new')
                     .type('form')
                     .send({ post : 
                                { 
                                    title : titlev,
                                    body : bodyv,
                                    tags : tagsv
                                }
                           })
                     .end(cb);
}

function addCommentToPost(permalink, authorv, emailv, bodyv, cb){
     agent.post(httpRootPath+'/post/' + permalink + '/addcomment')
                     .type('form')
                     .send({ comment : 
                                { 
                                    author : authorv,
                                    email : emailv,
                                    body : bodyv
                                }
                           })
                     .end(cb);
}

describe("/post/new page tests", function(){
    
    describe("GET /post/new", function(){
        it("should return 200 http status", function(done){
               goToNewPost(function(err, res){
                         logError(err);
                         res.status.should.be.equal(200);
                         done();
                      });
        });
        
        describe("For anonymous users", function(){ 
            it("should redirect to login page", function(done){
               goToNewPost(function(err, res){
                        logError(err);
                        res.redirects.should.include(httpRootPath+'/login');
                        done();
                     });
            });
        });
    });
        
    describe("POST /post/new", function(){ 
        describe("For anonymous users", function(){ 
            it("should redirect to login page after attempting send new post without login", function(done){
                 importUsersData(function(){
                   importPostsData(function(){
                        postEntryData(
                            TestPost1.title,
                            TestPost1.body,
                            TestPost1.tags,
                            
                            function(err, res){
                                should.not.exist(err);
                                res.redirects.should.include(httpRootPath+'/login');
                                done();
                            }
                        );
                   });
                 });
            });
        });
    
        describe("For authenticated users", function(){
            it("should not redirect to login page", function(done){
                importUsersData(function(){
                   importPostsData(function(){
                      login(
                            TestUser.username,
                            TestUser.password,
                            function(err, res){
                                should.not.exist(err);
                                goToNewPost(function(err, res){
                                    res.redirects.should.be.empty;
                                    res.status.should.be.equal(200);
                                    done();
                                });
                            }
                      );
                   });
                });
            });
            
            it("should redirects to view post page after posting new topic", function(done){
                importUsersData(function(){
                   importPostsData(function(){
                       login(
                         TestUser.username,
                         TestUser.password,
                         function(err, res){
                            should.not.exist(err);
                            postEntryData(
                                    TestPost1.title,
                                    TestPost1.body,
                                    TestPost1.tags,
                                    
                                    function(err, res){
                                        res.redirects.should.not.be.empty;
                                        res.redirects[0].should.match(/\/post\/([A-Za-z0-9]+)\/view/i);
                                        done();
                                    }
                            );
                        });
                   });
                });
            });
            
            it("should contain post data after redirects to view post page", function(done){
                importUsersData(function(){
                   importPostsData(function(){
                       login(
                         TestUser.username,
                         TestUser.password,
                         function(err, res){
                            should.not.exist(err);
                            postEntryData(
                                    TestPost1.title,
                                    TestPost1.body,
                                    TestPost1.tags,
                                    
                                    function(err, res){
                                        should.not.exist(err);
                                        var $ = cheerio.load(res.text);
                                        $('.post-title-view').text().should.be.equal(TestPost1.title.toUpperCase());
                                        $('.post-body-view').text().should.not.be.empty;
                                        $('.post-tags-view').text().should.be.equal(TestPost1.tags);
                                        done();
                                    }
                            );
                        });
                   });
                });
            });
        });
    });
    
    describe("Comments for post", function(){
        describe("for anonymous user", function(){
            it("should display region for adding comment", function(done){
                importUsersData(function(){
                    importPostsData(function(){
                            goToViewPostByPermalink('140f01bfd2f126e4d99128a6cf8e5d17', function(err, res){
                                var $ = cheerio.load(res.text);
                                $('.comment-form').length.should.be.above(0);
                                $('.comment-form').children('input.comment-author').length.should.be.above(0);
                                $('.comment-form').children('input.comment-email').length.should.be.above(0);
                                $('.comment-form').children('textarea.comment-body').length.should.be.above(0);
                                $('.comment-form').children('input[type="submit"]').length.should.be.above(0);
                                done();
                            });
                    });
                });
            }); 
            describe("POST /post/:permalink/addcomment", function(){
                it("should return 200 http status after add comment for viewing post", function(done){
                    importUsersData(function(){
                        importPostsData(function(){
                            addCommentToPost(TEST_POST_PERMALINK, 
                                'anonUser',
                                'anon@email.com',
                                'Very nice lorem ipsum post!',
                                function(err, res){
                                    should.not.exist(err);
                                    res.status.should.be.equal(200);
                                    done();
                                }
                            );
                        });
                    });
                });
                
                it("should display comment data after adding comment for viewing post", function(done){
                    importUsersData(function(){
                        importPostsData(function(){
                            addCommentToPost(TEST_POST_PERMALINK, 
                                'anonUser',
                                'anon@email.com',
                                'Very nice lorem ipsum post!',
                                function(err, res){
                                    should.not.exist(err);
                                    var $ = cheerio.load(res.text);
                                    $('.comments-ribbon').children('.post-comment').length.should.equal(1); 
                                    done();
                                }
                            );
                        });
                    });
                });
                
                 it("should redirect to view post page after adding comment for viewing post", function(done){
                    importUsersData(function(){
                        importPostsData(function(){
                            addCommentToPost(TEST_POST_PERMALINK, 
                                'anonUser',
                                'anon@email.com',
                                'Very nice lorem ipsum post!',
                                function(err, res){
                                    should.not.exist(err);
                                    res.redirects.should.include(httpRootPath+'/post/'+TEST_POST_PERMALINK+ '/view');
                                    done();
                                }
                            );
                        });
                    });
                });
            });
        });
    });
    
});