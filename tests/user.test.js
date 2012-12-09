var mocha = require('../node_modules/mocha'),
	express = require('../node_modules/express'),
	should = require('../node_modules/should'),	
	superagent = require("../node_modules/superagent"),		
	testUtils = require("../lib/shared/test.utils"),
	cheerio = require('cheerio'),
	agent = superagent.agent(),
    MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    mDbImport = new MdbUnit.Import(),
	httpRootPath = 'http://localhost:3000',
    DB_NAME = "M101Test",
    COL_USERS = "users",
    USER_NAME = "cyberlight",
    USER_PASSWORD = "t3stP@$$w0Rd",
    E_MAIL = "",
    EMPTY_DATA_VALUE="",
    NOT_MATCHED_PASSWORD = "nOtMaTcHeD_PassWord";
    
testUtils.startApp(3000);

function importUsersData(cb){
     mDbImport.setDb(DB_NAME).setCollection(COL_USERS).setDrop(true).importData("tests\\importData\\users.json", function(code){
        code.should.be.equal(0);
        cb();
    });
}

function logError(err){
    if(err)
        console.log(err);
}

function postData(username, password, verify, email, cb){
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


describe('User signup page',function(){
	describe('GET /signup', function(){
		it('should be return 200 http status', function(done){
			agent.get(httpRootPath+'/signup').end(function(err, res){
				logError(err);
                
				res.status.should.equal(200);
				done();
			});
		});
		
		it('should be contain text "Sign up"', function(done){
			agent.get(httpRootPath+'/signup').end(function(err, res){
				logError(err);
                
				var $ = cheerio.load(res.text);
				$('h1').text().should.equal("Sign up");				
				done();
			});
		});
	});
    describe('POST /signup', function(){
        it('should be returned 200 http status', function(done){ 
            postData(
            
                USER_NAME, 
                USER_PASSWORD, 
                USER_PASSWORD, 
                E_MAIL,
                
                function(err, res){
                    logError(err);
                        
                    res.status.should.equal(200);
                    done();
                }
            );
        });
        
        it('and should be redirected to "' + httpRootPath + '/login"', function(done){
            importUsersData(function(){
                postData(
                    
                    USER_NAME, 
                    USER_PASSWORD, 
                    USER_PASSWORD, 
                    E_MAIL,
                        
                    function(err, res){
                        logError(err);
                        
                        res.status.should.equal(200);
                        res.redirects.should.include(httpRootPath+'/login');
                        done();
                    }
                );
            });
        });
        
        describe('send valid user credentials to "' + httpRootPath + '/login"', function(){        
            it('should return http status 200', function(done){
                importUsersData(function(){
                    postData(
                    
                        USER_NAME, 
                        USER_PASSWORD, 
                        USER_PASSWORD, 
                        E_MAIL,
                        
                        function(err, res){
                            logError(err);
                            
                            res.status.should.equal(200);
                            done();
                        }
                    );
                });
            });
            
            it("should redirect to /login page for valid user data with not empty e-mail 'mymail@gmail.com'", function(done){
                importUsersData(function(){
                    postData(
                        USER_NAME, 
                        USER_PASSWORD, 
                        USER_PASSWORD, 
                        "mymail@gmail.com",
                        
                        function(err, res){
                            logError(err);
                            
                            res.status.should.equal(200);
                            res.redirects.should.include(httpRootPath+'/login');                                                                                                                                         
                            done();
                        }
                    );
                });
            });
            
            it("should not redirect to /login page for existing user in database", function(done){
                importUsersData(function(){
                    postData(
                        "user1", 
                        USER_PASSWORD, 
                        USER_PASSWORD, 
                        "user1@email.com",
                        
                        function(err, res){
                            logError(err);
                            
                            res.status.should.equal(200);
                            res.redirects.should.be.empty;
                            done();
                        }
                    );
                });
            });
            
            it("should show error info after post data on /signup page for existing user in database", function(done){
                importUsersData(function(){
                    postData(
                        "user1", 
                        USER_PASSWORD, 
                        USER_PASSWORD, 
                        "user1@email.com",
                        
                        function(err, res){
                            logError(err);
                            var $ = cheerio.load(res.text);
                            $('.form-error').text().should.be.equal('User \"user1\" already exists');
                            done();
                        }
                    );
                });
            });
        });
        
        describe('send not valid user credentials"' + httpRootPath + '/login"', function(){
            it('should not redirect to login page when sended not matched passwords', function(done){
                postData(
                
                    USER_NAME, 
                    USER_PASSWORD, 
                    NOT_MATCHED_PASSWORD, 
                    E_MAIL,
                    
                    function(err, res){
                        logError(err);
                        
                        res.redirects.should.be.empty;
                        done();
                    }
                );
            });
            
            it("should show error for invalid e-mail value 'e-mail@'", function(done){
                postData(
                
                    USER_NAME, 
                    USER_PASSWORD, 
                    USER_PASSWORD, 
                    "e-mail@",
                    
                    function(err, res){
                        logError(err);
                        
                        var $ = cheerio.load(res.text);
                        $('div#email-error').text().should.be.equal("invalid email address");
                        done();
                    }
                );
            });
            
            it("should show error for invalid e-mail value 'm@.com'", function(done){
                postData(
                    USER_NAME, 
                    USER_PASSWORD, 
                    USER_PASSWORD, 
                    "m@.com",
                    
                    function(err, res){
                        logError(err);
                        
                        var $ = cheerio.load(res.text);
                        $('div#email-error').text().should.be.equal("invalid email address");
                        done();
                    }
                );
            }); 

            it('should display previously entered data for text fields after POST request', function(done){
                postData(
                    
                    USER_NAME, 
                    USER_PASSWORD, 
                    NOT_MATCHED_PASSWORD, 
                    E_MAIL,
                    
                    function(err, res){
                        logError(err);
                        
                        var $ = cheerio.load(res.text);
                        $('input[name="user[username]"]').attr('value').should.be.equal(USER_NAME);
                        $('input[name="user[password]"]').attr('value').should.be.equal(USER_PASSWORD);
                        $('input[name="user[verify]"]').attr('value').should.be.equal(NOT_MATCHED_PASSWORD);
                        $('input[name="user[email]"]').attr('value').should.be.equal(E_MAIL);
                        done();
                    }
                );
            });
            
            describe("with empty fields data for user", function(){
                it("should not redirect to login page", function(done){
                    postData(
                        EMPTY_DATA_VALUE,
                        EMPTY_DATA_VALUE,
                        EMPTY_DATA_VALUE,
                        EMPTY_DATA_VALUE,
                        
                        function(err, res){
                            logError(err);
                            
                            res.redirects.should.be.empty;
                            done();
                        }
                    )
                });
            
                it("should show errors for each field", function(done){
                    postData(
                        EMPTY_DATA_VALUE,
                        EMPTY_DATA_VALUE,
                        EMPTY_DATA_VALUE,
                        EMPTY_DATA_VALUE,
                        
                        function(err, res){
                            logError(err);
                            
                            var $ = cheerio.load(res.text);
                            $('div#username-error').text().should.be.equal('invalid username. try just letters and numbers');
                            $('div#password-error').text().should.be.equal('invalid password');
                            $('div#verify-error').text().should.be.equal('password must match');
                            done();
                        }
                    )
                });
            });
        });
    });
});

describe("Login page tests", function(){
    describe('GET /login', function(){
		it('should be return 200 http status', function(done){
			agent.get(httpRootPath+'/login').end(function(err, res){
				logError(err);
                
				res.status.should.equal(200);
				done();
			});
		});

        it("should include 'Login' on page", function(done){
            agent.get(httpRootPath+'/login').end(function(err, res){
				logError(err);
                
				var $ = cheerio.load(res.text);
				$('h1').text().should.equal("Login");				
				done();
			});
        });
	});
    
    describe('POST /login', function(){
        it('should return 200 http status', function(done){ 
            postLoginData(
            
                "user1", 
                "password1",                 
                
                function(err, res){
                    logError(err);
                        
                    res.status.should.equal(200);
                    done();
                }
            );
        });        
        
        it('should redirect to / after posing valid username and password', function(done){ 
            postLoginData(
            
                "user1", 
                "password1",
                
                function(err, res){
                    logError(err);
                    
                    res.status.should.equal(200);
                    
                    res.redirects.should.include(httpRootPath+'/');    
                    done();
                }
            );
        });
        
        it('should not redirect to / after posing not valid user credentials', function(done){ 
            postLoginData(
            
                "user1", 
                "password2",
                
                function(err, res){
                    logError(err);
                    
                    res.redirects.should.be.empty;  
                    done();
                }
            );
        });
        
        
        it("should contains error info after posing not valid user credentials", function(done){
            postLoginData(
                "user1", 
                "password2",
                
                function(err, res){
                    logError(err);
                    
                    var $ = cheerio.load(res.text);
                    $('.form-error').text().should.equal("Invalid Login");	
                    done();
                }
            );
        });
    });
});