var mocha = require('../node_modules/mocha'),
	express = require('../node_modules/express'),
	should = require('../node_modules/should'),	
	superagent = require("../node_modules/superagent"),		
	testUtils = require("../lib/shared/test.utils"),		
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
				res.text.should.include("Sign up page");
				done();
			});
		});
	});
});