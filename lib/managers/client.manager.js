var mongodb = require('../../node_modules/mongodb');    
function ClientManager(config){    
    var getDb = function(cb){
           var configDb = config.db,
               server = null,
               mongoClient = null,
               err = null,               
               connString = "mongodb://"+configDb.host+":"+configDb.port+"/" + configDb.name;               
               
               mongodb.MongoClient.connect(connString, configDb.options, function(err, db){
                  cb(err, db);  
               });              
        }
        return{
            getDb : getDb
        }
}

exports.ClientManager = ClientManager;