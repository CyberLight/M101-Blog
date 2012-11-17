var mocha = require('../node_modules/mocha'),
	express = require('../node_modules/express'),
	should = require('../node_modules/should'),	
	superagent = require("../node_modules/superagent"),		
	testUtils = require("../lib/shared/test.utils"),
	cheerio = require('../node_modules/cheerio'),	
	agent = superagent.agent(),
	httpRootPath = 'http://localhost:3000';
	
testUtils.startApp(3000);

describe('Main page', function(){
	describe('GET /', function(){
		it('should returned 200 http status', function(done){					
			agent.get(httpRootPath).end(function(err,res){
				if(err)
					console.log(err);
				res.status.should.equal(200);
				return done();
			});
		});
		
		it('should include test "Express"', function(done){
			agent.get(httpRootPath).end(function(err,res){
				if(err)
					console.log(err);
				var $ = cheerio.load(res.text);
				$('h1').text().should.include("Express");				
				return done();
			});
		});
	});	
});
