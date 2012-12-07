var UserService = require('../lib/services/user.service').UserService,
    PasswordManager = require('../lib/sec/passmgr').PasswordManager,
    should = require('../node_modules/should'),
    mongodb = require('../node_modules/mongodb'),
    UoW = require('../lib/data/uow').UoW,
    MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    mDbImport = new MdbUnit.Import(),
    Interface = require('../lib/interfaces/interface').jspatterns.contracts.Interface,
    IUserService = new Interface("IUserService", ["createUser", "validateLogin"]),
    DB_NAME = "M101Test", 
    COL_USERS = "users",
    server = null,
    db = null,
    userService = null,
    testUser1 = { _id : 'testUser1', 
                  password : 'password1',
                  email : 'testUser@mail.com'},
    user1 = {
        _id : 'user1',
        password : 'password1'     
    },
    user1WrongPass = {
        _id : 'user1',
        password : 'WrongPassword1'
    };

function importUsersData(cb){
     mDbImport.setDb(DB_NAME)
              .setCollection(COL_USERS)
              .setDrop(true)
              .importData("tests\\importData\\users.json", 
                            function(code){
                                code.should.be.equal(0);
                                cb();
                            }
                         );
}
    
before(function(){
    server = new mongodb.Server("localhost", 27017, {auto_reconnect : true, poolSize : 4, socketOptions : {encoding : "utf-8"}});
	db = new mongodb.Db(DB_NAME, server, {safe: true});
	db.on("close", function(error){
		console.log("--- connection closed successfully");
	});
    userService = new UserService(new UoW(db), new PasswordManager());
});

describe("User Service class tests", function(){
    it("should created successful", function(){
        should.exist(userService);
    });
    
    it("should implement all methods of IUserService", function(){
        (function(){
            Interface.ensureImplements(userService, IUserService);
        }).should.not.throw();
    });
    
    it("should create new user successfully", function(done){
        importUsersData(function(){
            userService.createUser(testUser1, 
                                     function(err, users){
                                        should.not.exist(err);
                                        users.should.have.lengthOf(1);
                                        var user = users[0];
                                        user._id.should.equal(testUser1._id);
                                        user.email.should.equal(testUser1.email);
                                        user.password.should.not.equal(testUser1.password);
                                        user.password.should.include(',');
                                        done();
                                     });
         });
    });
    
    it("should validation success for user by login amd right password", function(done){   
        importUsersData(function(){
            userService.validateLogin(user1, function(err, result){
                should.not.exist(err);
                result.should.be.equal(true);
                done();
            }); 
        });
    });
    
    it("should validation fail of user by existed login amd wrong password", function(done){   
        importUsersData(function(){
            userService.validateLogin(user1WrongPass, function(err, result){
                should.not.exist(err);
                result.should.be.equal(false);
                done();
            }); 
        });
    });
});