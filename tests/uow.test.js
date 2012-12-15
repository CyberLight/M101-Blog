var mocha = require('../node_modules/mocha'),
    mongodb = require('../node_modules/mongodb'),
    should = require('../node_modules/should'),
    UoW = require('../lib/data/uow').UoW,
    Interface = require('../lib/interfaces/interface').jspatterns.contracts.Interface,
    IUow = new Interface("IUow", ['users', 'posts']),
    uow = null,
    server = null,
    db = null;

beforeEach(function(){
    server = new mongodb.Server("localhost", 27017, {auto_reconnect : true, poolSize : 4, socketOptions : {encoding : "utf-8"}});
	db = new mongodb.Db(DB_NAME, server, {safe: true});
	db.on("close", function(error){
		console.log("--- connection closed successfully");
	});
    uow = new UoW(db);
});
    
describe("Unit of Work tests", function(){

    it("should created successfull", function(){
        should.exist(uow);
    });
    
    it("should implementat IUow interface", function(){
        (function(){
            Interface.ensureImplements(uow, IUow);
        }).should.not.throw();
    });
    
    describe("'users' property of UoW", function(){
    
        it("should return users repository from 'users' of UoW", function(){
            uow.users().collection.should.be.equal('users');
        });
        
        it("should return users repository with setted db from", function(){
            var returnedDb = uow.users().getDb();
            should.exist(returnedDb);
            returnedDb.should.be.equal(db);
        });

    });
    
    describe("'posts' property of UoW", function(){
        
        it("should return posts repository from 'posts' of UoW", function(){
            uow.posts().collection.should.be.equal('posts');
        });
        
    });
});