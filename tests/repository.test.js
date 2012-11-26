var mocha = require('mocha'),
	mongodb = require('mongodb'),
	should = require('should'),	
	server = null,
	db = null,
    Interface = require('../lib/interfaces/interface').jspatterns.contracts.Interface;
	Repository = require("../lib/repositories/repository").Repository,
    IRepository = new Interface("IRepository", ['collection', 'getDb', 'setDb', 'findOne']),
    MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    mDbImport = new MdbUnit.Import(),
    DB_NAME = "M101Test",
    COL_USERS = "users";

function importUsersData(cb){
     mDbImport.setDb(DB_NAME).setCollection(COL_USERS).setDrop(true).importData("tests\\importData\\users.json", function(code){
        code.should.be.equal(0);
        cb();
    });
}
   
beforeEach(function(){
	server = new mongodb.Server("localhost", 27017, {auto_reconnect : true, poolSize : 4, socketOptions : {encoding : "utf-8"}});
	db = new mongodb.Db(DB_NAME, server, {safe: true});
	db.on("close", function(error){
		console.log("--- connection closed successfully");
	});
});
    
describe("Repository object", function(){
	it("should created successfullt", function(){
		var repository = new Repository(COL_USERS);
		should.exist(repository);		
	})
	
    it("should implement IRepository interface", function(){
        var repository = new Repository(COL_USERS);
            
        (function(){
            Interface.ensureImplements(repository, IRepository);
        }).should.not.throw();
    });
    
	it("should return Collection name in property 'collection'", function(){
		var repository = new Repository(COL_USERS);
		repository.collection.should.be.equal(COL_USERS);			
	});
	
	it("should return db object fron 'getDb' setted using 'setDb'", function(){
		var repository = new Repository(COL_USERS),
			retDb = null;
		repository.setDb(db);
		retDb = repository.getDb();
		should.exist(retDb);
		retDb.should.be.equal(db);
	});
	
	
	describe("CRUD operations", function(){
		describe("select operations", function(){
			it("should return one user by _id", function(done){
                importUsersData(function(){
                    var repository = new Repository(COL_USERS);
                    repository.setDb(db);
                    repository.findOne({"_id": "user1"}, function(err, item){
                        if(err)
                            console.log(err);                        
                        should.exist(item);
                        item._id.should.be.equal("user1");
                        done();
                    });
                });
			});
		});
	});
});

	