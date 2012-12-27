var mocha = require('../node_modules/mocha'),
	express = require('../node_modules/express'),
	should = require('../node_modules/should'),	
	superagent = require("../node_modules/superagent"),
	testUtils = require("../lib/shared/test.utils"),
    MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    Utils = require("../lib/utils/utils").Utils,
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
    TEST_POST_PERMALINK = '140f01bfd2f126e4d99128a6cf8e5d17',
    TEST_POST_PERMALINK_WITH_COMMENTS = 'f24bb941e34cff2fda983b56db603425',
    EMPTY_STR_VALUE = '',
    AnonymousUser = {
        author : 'anonUser',
        email : 'anon@email.com',
        body : 'Very nice lorem ipsum post!'
    };
    
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

function addLikeToPostComment(permalink, token, cb){
     agent.post(httpRootPath+'/post/' + permalink + '/addlike')
                     .type('form')
                     .send({
                             token : token
                           })
                     .end(cb);
}

function addCommentToPostForLoggedInUser(permalink, bodyv, cb){
     agent.post(httpRootPath+'/post/' + permalink + '/addcomment')
                     .type('form')
                     .send({ comment : 
                                {                                     
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
        describe("like system for all users", function(){
            it("should show \"like\" button for comment", function(done){
                importUsersData(function(){
                   importPostsData(function(){
                        addCommentToPost(TEST_POST_PERMALINK, 
                                    'anonym', 
                                    EMPTY_STR_VALUE, 
                                    'comment from anonym',
                                    function(err, res){
                                        var $ = cheerio.load(res.text);
                                        var commentLike = $('.comment-like');
                                        commentLike.length.should.be.equal(1);
                                        $(commentLike).children('.like').text().should.be.equal("Ã");
                                        $(commentLike).children('.like-info').text().should.be.equal("0");
                                        done();
                                    }
                        );
                    });
                });
            });
            
            it("should include token in base64 format with encoded milliseconds of datetime and ordinal for \"like\" button of comment", function(done){
                importUsersData(function(){
                   importPostsData(function(){
                        addCommentToPost(TEST_POST_PERMALINK, 
                                    'anonym', 
                                    EMPTY_STR_VALUE, 
                                    'comment from anonym',
                                    function(err, res){
                                        var $ = cheerio.load(res.text),
                                            dataToken = $('.like').attr('data-token');
                                        Utils.fromBase64(dataToken).should.be.match(/^[0-9]{13}-[0-9]{1,}$/i);
                                        done();
                                    }
                        );
                    });
                });
            });
            
            it("should include permalink for \"like\" button of comment", function(done){
                importUsersData(function(){
                   importPostsData(function(){
                        addCommentToPost(TEST_POST_PERMALINK, 
                                    'anonym', 
                                    EMPTY_STR_VALUE, 
                                    'comment from anonym',
                                    function(err, res){
                                        var $ = cheerio.load(res.text),
                                            postPermalink = $('.like').attr('data-plink');
                                        postPermalink.should.be.equal(TEST_POST_PERMALINK);
                                        done();
                                    }
                        );
                    });
                });
            });
            describe('POST /post/:permalink/addlike', function(){
                it("should return 200 http status when try like the comment", function(done){
                    importUsersData(function(){
                       importPostsData(function(){
                            var commentOrdinal = '0',
                                token = Utils.toBase64(Utils.format("{0}-{1}", new Date().getTime().toString(), commentOrdinal));
                                
                            addLikeToPostComment(TEST_POST_PERMALINK_WITH_COMMENTS,
                                                 token,
                                                 function(err, res){
                                                    should.not.exists(err);
                                                    res.status.should.be.equal(200);
                                                    done();
                                                 });
                       });
                    });
                });
                
                it("should return json response object with fields after posting \"like\" for comment", function(done){
                    importUsersData(function(){
                       importPostsData(function(){
                            var commentOrdinal = '0',
                                token = Utils.toBase64(Utils.format("{0}-{1}", new Date().getTime().toString(), commentOrdinal));
                                
                            addLikeToPostComment(TEST_POST_PERMALINK_WITH_COMMENTS,
                                                 token,
                                                 function(err, res){
                                                    should.not.exists(err);
                                                    res.body.hasOwnProperty('success').should.be.ok;
                                                    res.body.hasOwnProperty('likes').should.be.ok;
                                                    done();
                                                 });
                       });
                    });
                });
                
                 it("should return json response object with count of likes after posting \"like\" for comment", function(done){
                    importUsersData(function(){
                       importPostsData(function(){
                            var commentOrdinal = '0',
                                token = Utils.toBase64(Utils.format("{0}-{1}", new Date().getTime().toString(), commentOrdinal));                         
                                
                            addLikeToPostComment(TEST_POST_PERMALINK_WITH_COMMENTS,
                                                 token,
                                                 function(err, res){
                                                    should.not.exists(err);
                                                    res.body.success.should.be.ok;
                                                    res.body.likes.should.be.equal(1);
                                                    done();
                                                 });
                       });
                    });
                });                
            });
        });
        describe("for logged in user", function(){
            it("should display only comment's body textbox for adding comment", function(done){
                importUsersData(function(){
                   importPostsData(function(){
                       login(
                         TestUser.username,
                         TestUser.password,
                         function(err, res){
                            should.not.exist(err);
                            goToViewPostByPermalink(TEST_POST_PERMALINK, function(err, res){
                                var $ = cheerio.load(res.text);
                                $('.comment-form').length.should.be.above(0);
                                $('.comment-form').children('input.comment-author').length.should.be.equal(0);
                                $('.comment-form').children('input.comment-email').length.should.be.equal(0);
                                $('.comment-form').children('textarea.comment-body').length.should.be.above(0);
                                $('.comment-form').children('input[type="submit"]').length.should.be.above(0);
                                done();
                            });
                         }
                       )
                   });
                });
            });
            
            it("should display adding comment without filling author and email for post", function(done){
                importUsersData(function(){
                   importPostsData(function(){
                       login(
                         TestUser.username,
                         TestUser.password,
                         function(err, res){
                            should.not.exist(err);
                            addCommentToPostForLoggedInUser(
                                        TEST_POST_PERMALINK,
                                        'Logged in user1 comment to this post',
                                        function(err, res){
                                            should.not.exist(err);
                                            var $ = cheerio.load(res.text),
                                                firstComment = null,
                                                author=null;
                                            $('.comments-ribbon').children('.post-comment').length.should.be.above(0);
                                            firstComment = $('.comments-ribbon').children('.post-comment')[0];
                                            author = $(firstComment).children('.author');
                                            $(author).text().should.be.equal(' user1');
                                            done();
                                        });
                         }
                       )
                   });
                });
            })
        });
        
        describe("for anonymous user", function(){
            it("should display region for adding comment", function(done){
                importUsersData(function(){
                    importPostsData(function(){
                        logout(function(){
                            goToViewPostByPermalink(TEST_POST_PERMALINK, function(err, res){
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
            }); 
            describe("POST /post/:permalink/addcomment", function(){
                it("should return 200 http status after add comment for viewing post", function(done){
                    importUsersData(function(){
                        importPostsData(function(){
                            addCommentToPost(TEST_POST_PERMALINK, 
                                AnonymousUser.author,
                                AnonymousUser.email,
                                AnonymousUser.body,
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
                                AnonymousUser.author,
                                AnonymousUser.email,
                                AnonymousUser.body,
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
                                AnonymousUser.author,
                                AnonymousUser.email,
                                AnonymousUser.body,
                                function(err, res){
                                    should.not.exist(err);
                                    res.redirects.should.include(httpRootPath+'/post/'+TEST_POST_PERMALINK+ '/view');
                                    done();
                                }
                            );
                        });
                    });
                });
                
               it("should not redirect to view post data after trying add comment with empty author and body fields", function(done){
                    importUsersData(function(){
                        importPostsData(function(){
                            addCommentToPost(TEST_POST_PERMALINK, 
                                EMPTY_STR_VALUE,
                                EMPTY_STR_VALUE,
                                EMPTY_STR_VALUE,
                                function(err, res){
                                    should.not.exist(err);
                                    res.redirects.should.be.empty;
                                    done();
                                }
                            );
                        });
                    });
                });
                
                it("should show error information after trying add comment without filling author and body fields", function(done){
                    importUsersData(function(){
                        importPostsData(function(){
                            addCommentToPost(TEST_POST_PERMALINK, 
                                EMPTY_STR_VALUE,
                                EMPTY_STR_VALUE,
                                EMPTY_STR_VALUE,
                                function(err, res){
                                    should.not.exist(err);
                                    var $ = cheerio.load(res.text);
                                    $('div#comment-author-error').text().should.be.equal("invalid author of comment");
                                    $('div#comment-body-error').text().should.be.equal("invalid body of comment");
                                    done();
                                }
                            );
                        });
                    });
                });
                
                it("should show error information after trying add comment with wrong email, author and body fields", function(done){
                    importUsersData(function(){
                        importPostsData(function(){
                            addCommentToPost(TEST_POST_PERMALINK, 
                                EMPTY_STR_VALUE,
                                "@info.com",
                                EMPTY_STR_VALUE,
                                function(err, res){
                                    should.not.exist(err);
                                    var $ = cheerio.load(res.text);
                                    $('div#comment-author-error').text().should.be.equal("invalid author of comment");
                                    $('div#comment-email-error').text().should.be.equal("invalid email address");
                                    $('div#comment-body-error').text().should.be.equal("invalid body of comment");
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