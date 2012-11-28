var mocha = require('mocha'),
	mongodb = require('mongodb'),
	should = require('should'),	
	server = null,
	db = null,
    Interface = require('../lib/interfaces/interface').jspatterns.contracts.Interface;
	Repository = require("../lib/repositories/repository").Repository,
    IRepository = new Interface("IRepository", ['collection', 'getDb', 'setDb', 'findOne', 'find', 'insert', 'remove', 'update', 'count']),
    MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    mDbImport = new MdbUnit.Import(),
    DB_NAME = "M101Test",
    COL_USERS = "users",
    repository = null;

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
   
beforeEach(function(){
	server = new mongodb.Server("localhost", 27017, {auto_reconnect : true, poolSize : 4, socketOptions : {encoding : "utf-8"}});
	db = new mongodb.Db(DB_NAME, server, {safe: true});
	db.on("close", function(error){
		console.log("--- connection closed successfully");
	});
    repository = new Repository(COL_USERS);
    repository.setDb(db);
});
    
describe("Repository object", function(){
	it("should created successfullt", function(){		
		should.exist(repository);		
	})
	
    it("should implement IRepository interface", function(){            
        (function(){
            Interface.ensureImplements(repository, IRepository);
        }).should.not.throw();
    });
    
	it("should return Collection name in property 'collection'", function(){		
		repository.collection.should.be.equal(COL_USERS);			
	});
	
	it("should return db object fron 'getDb' setted using 'setDb'", function(){
		var retDb = null;		
		retDb = repository.getDb();
		should.exist(retDb);
		retDb.should.be.equal(db);
	});
	
	describe("CRUD operations", function(){
		describe("select operations", function(){
			it("should return one user by _id", function(done){
                importUsersData(function(){                   
                    repository.findOne({"_id": "user1"}, function(err, item){
                        logError(err);
                        should.exist(item);
                        item._id.should.be.equal("user1");
                        done();
                    });
                });
			}); 
            it("should return all users", function(done){
                importUsersData(function(){
                    repository.find({}, {}, function(err, users){
                        logError(err);
                        should.exist(users);                        
                        users.length.should.be.equal(4);
                        done();
                    });
                });
            });
            it("should insert new user", function(done){
                importUsersData(function(){
                    repository.insert({'_id' : 'user5', password : 'notencruptedpassword'},function(err, user){
                        logError(err);
                        should.exist(user);
                        repository.find({},{}, function(err, users){
                            users.length.should.be.equal(5);
                            done();
                        });
                    });
                });
            });
            it("should remove user by _id", function(done){
                importUsersData(function(){
                    repository.remove({'_id' : 'user4'}, {}, function(err, numberRemoved){
                        logError(err);
                        numberRemoved.should.be.equal(1);
                        repository.find({},{}, function(err, users){
                            users.length.should.be.equal(3);
                            done();
                        });
                    });
                });
            });
            it("should update password by user _id", function(done){
                importUsersData(function(){
                    var PASSWORD_VALUE = 'passwordChanged',
                        USER_ID = "user4";
                    repository.update({'_id' : USER_ID}, { '$set' : { 'password' : PASSWORD_VALUE } }, {}, function(err, numberUpdated){
                        logError(err);                        
                        numberUpdated.should.be.equal(1);
                        repository.findOne({"_id": USER_ID}, function(err, item){
                            item.password.should.be.equal(PASSWORD_VALUE);
                            done();
                        });
                    });
                });
            });
            it("should return count of users in collection", function(done){
                importUsersData(function(){
                    repository.count({}, {}, function(err, count){
                        logError(err);
                        count.should.be.equal(4);
                        done();
                    });
                });
            });
		});
	});
});

	