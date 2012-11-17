var mocha = require('../node_modules/mocha'),
	express = require('../node_modules/express'),
	should = require('../node_modules/should'),	
	superagent = require("../node_modules/superagent"),		
	testUtils = require("../lib/shared/test.utils"),
	cheerio = require('cheerio'),
	agent = superagent.agent(),
	httpRootPath = 'http://localhost:3000';

testUtils.startApp(3000);

describe('User signup page',function(){
	describe('GET /signup', function(){
		it('should be return 200 http status', function(done){
			agent.get(httpRootPath+'/signup').end(function(err, res){
				if(err)
					console.log(err);
				res.status.should.equal(200);
				done();
			});
		});
		
		it('should be contain text "Sign up page"', function(done){
			agent.get(httpRootPath+'/signup').end(function(err, res){
				if(err)
					console.log(err);
				var $ = cheerio.load(res.text);
				$('h1').text().should.equal("Sign up page");				
				done();
			});
		});
	});
    describe('POST /signup', function(){
        it('should be returned 200 http status', function(done){ 
            agent.post(httpRootPath+'/signup').end(function(err, res){
                if(err)
                    console.log(err);
                    
                res.status.should.equal(200);                
                done();
            });
        });
        
        it('and should be redirected to "' + httpRootPath + '/login"', function(done){
            agent.post(httpRootPath+'/signup').end(function(err, res){
                if(err)
                    console.log(err);
                    
                res.redirects.should.include(httpRootPath+'/login');
                done();
            });
        });
    });
});