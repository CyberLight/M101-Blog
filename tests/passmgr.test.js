var PasswordManager = require('../lib/sec/passmgr').PasswordManager,
    should = require('should'),
    Interface = require('../lib/interfaces/interface').jspatterns.contracts.Interface,
    IPasswordManager  = new Interface("IPasswordManager", ['makeSalt']),
    passmgr = null,
    SUPER_PASSWORD = 'mysuperpassord';
    
before(function(){
    passmgr = new PasswordManager();
})
    
describe("Password Manager tests", function(){
    it("should be created successfuly", function(){
        should.exist(passmgr);
    });
    
    it("should implements IPasswordManager interface", function(){
        (function(){
            Interface.ensureImplements(passmgr, IPasswordManager);
        }).should.not.throw();
    });
    
    it("should return salt symbols with length equals 5", function(done){
        passmgr.makeSalt(function(err, salt){
            should.exist(salt);
            salt.should.have.lengthOf(5);
            done();
        });
    });
    
    it("should return hash of password with salt delimited by comma", function(done){
        passmgr.makePasswordHash('mysuperpassord', 'salt', function(err, hash){
            hash.should.include(',');
            done();
        });
    });
    
    describe("use makePasswordHash with empty value in 'salt' parameter", function(){
        it("should return hash of password with salt length of 5", function(done){
            passmgr.makePasswordHash('mysuperpassord', '',function(err, hash){
                hash.should.include(',');
                console.log(hash);
                hash.split(',')[1].length.should.equal(5);
                done();
            });
        });
        
        it("should return hash of password with salt length of 5 with 'undefined' value in 'salt' parameter", function(done){
            passmgr.makePasswordHash('mysuperpassord', undefined ,function(err, hash){
                hash.should.include(',');
                console.log(hash);
                hash.split(',')[1].length.should.equal(5);
                done();
            });
        });
        
         it("should return hash of password with salt length of 5 with 'null' value in 'salt' parameter", function(done){
            passmgr.makePasswordHash(SUPER_PASSWORD, null,function(err, hash){
                hash.should.include(',');
                console.log(hash);
                hash.split(',')[1].length.should.equal(5);
                done();
            });
        });
    });
    
    describe("checking password hashes equality", function(){
        it("should return correct hash by password and salt", function(done){
            passmgr.makePasswordHash(SUPER_PASSWORD,null ,function(err, first_hash){                
                var salt = first_hash.split(',')[1];
                passmgr.makePasswordHash(SUPER_PASSWORD, salt,function(err, hash){
                    hash.should.equal(first_hash);
                    done();
                });               
            });
        })
    })
});