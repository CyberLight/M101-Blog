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
    COL_USERS = "users";
	
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

describe("/post/new page tests", function(){
    describe("GET /post/new", function(){
        it("should return 200 http status", function(done){
            agent.get(httpRootPath+"/post/new")
                 .end(function(err, res){
                     logError(err);
                     res.status.should.be.equal(200);
                     done();
                  });
        })
    });
});