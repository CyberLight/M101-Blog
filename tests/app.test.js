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
    COL_POSTS = "posts";
	
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

function logError(err){
    if(err)
        console.log(err);
}

function postLoginData(username, password, cb){
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

testUtils.startApp(3000);

describe('Main page', function(){
	describe('GET /', function(){
		it('should returned 200 http status', function(done){
			agent.get(httpRootPath).end(function(err,res){
				logError(err);
				res.status.should.equal(200);
				return done();
			});
		});
		
		it('should include test "M101 Blog"', function(done){
			agent.get(httpRootPath).end(function(err,res){
				logError(err);
				var $ = cheerio.load(res.text);
				$('h1').text().should.include("M101 Blog");
				return done();
			});
		});
        
        describe("for anonymous user", function(){
            it("should inclide 'Login', 'Sign up' link", function(done){
                agent.get(httpRootPath).end(function(err,res){
                    logError(err);
                    var $ = cheerio.load(res.text);
                    $('a.login').text().should.include("Login");
                    $('a.signup').text().should.include("Sign up");
                    return done();
                });
            });
            
            it("should include no more then 10 most newest posts on page", function(done){
                importUsersData(function(){
                    importPostsData(function(){
                        agent.get(httpRootPath).end(function(err,res){
                            logError(err);
                            var $ = cheerio.load(res.text);
                            $('a.post-title').length.should.be.above(1);
                            return done();
                        });
                    });
                });
            });
            
            it("should each href of post title contains valid link to post include permalink", function(done){
                importUsersData(function(){
                    importPostsData(function(){
                        agent.get(httpRootPath).end(function(err,res){
                            logError(err);
                            var $ = cheerio.load(res.text);
                            $('a.post-title').toArray().forEach(function(item){
                                $(item).attr('href').should.match(/\/post\/([A-Za-z0-9]+)\/view/i);
                            });
                            return done();
                        });
                    });
                });
            });
            
            it("should contains 10 placeholders for short part of post entry", function(done){
                importUsersData(function(){
                    importPostsData(function(){
                        agent.get(httpRootPath).end(function(err,res){
                            logError(err);
                            var $ = cheerio.load(res.text);
                            $('section.post-preview').length.should.be.equal(10);
                            return done();
                        });
                    });
                });
            });
            
            it("should contains short part of post entry in preview placeholder for each post", function(done){
                importUsersData(function(){
                    importPostsData(function(){
                        agent.get(httpRootPath).end(function(err,res){
                            logError(err);
                            var $ = cheerio.load(res.text);
                            $('section.post-preview').toArray().forEach(function(item){
                                $(item).text().length.should.be.within(5, 337);
                            });
                            done();
                        });
                    });
                });
            });
        });
        
        describe("for authenticated user",function(){
           it("should include Logout, New post,  link", function(done){
                importUsersData(function(){
                    postLoginData(
                        "user1",
                        "password1",
                        
                        function(err, res){
                           logError(err);
                           var $ = cheerio.load(res.text);
                           $('a.logout').text().should.include("Logout");
                           $('a.new-post').text().should.include("New Post");
                           done();
                        }
                    );
                });
           });
           
           it("should include 'Welcome: %user_name%' ", function(done){
                importUsersData(function(){
                    postLoginData(
                        "user1",
                        "password1",
                        
                        function(err, res){
                           logError(err);
                           var $ = cheerio.load(res.text);
                           $('span.username').text().should.equal("Welcome: user1");                           
                           done();
                        }
                    );
                });
           });
           
            it("should not include Welcome user after logout", function(done){
                importUsersData(function(){
                    postLoginData(
                        "user1",
                        "password1",
                        
                        function(err, res){
                           logError(err);
                           logout(function(err, res){
                               logError(err);
                               should.not.exist(err);
                               var $ = cheerio.load(res.text);
                               $('span.username').length.should.equal(0);
                               done();
                           });
                        }
                    );
                });
           });
        })
	});	
});
