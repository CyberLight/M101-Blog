var ClientManager = require('../lib/managers/client.manager').ClientManager,
    should = require('../node_modules/should'),
    config = require('../package.json').publicConfig;
    utils = require('../lib/utils/utils').Utils;
    clientManager = null;

before(function(){
    clientManager = new ClientManager(config);
});
    
describe("Connection manager tests", function(){
    it("should successfully created", function(){
        should.exist(clientManager);
    });
    
    it("should return database object when called getDb()", function(done){
        clientManager.getDb(function(err, db){            
            should.exist(db);
            done();
        });
    }); 

    it("should return err when called getDb() with wrong config", function(done){
        var configCloned = utils.deepClone(config),
            clientManager = null;
            configCloned.db.port = 55555;
            
        clientManager = new ClientManager(configCloned);
        clientManager.getDb(function(err, db){            
            should.exist(err);
            done();
        });
    }); 
});