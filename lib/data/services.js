var UserService = require('../services/user.service').UserService,
    mongodb = require('../../node_modules/mongodb'),
    ClientManager = require('../managers/client.manager').ClientManager,
    PasswordManager = require('../sec/passmgr').PasswordManager,
    UoW = require('./uow').UoW,
    config = require('../../package.json').publicConfig,
    services = (function(){    
        var clientManager = new ClientManager(config),           
            userServiceInstance = null,         
            getUserService = function(cb){    
                clientManager.getDb(function(err, db){
                    userServiceInstance = new UserService(new UoW(db), new PasswordManager())
                    cb(err, userServiceInstance);
                });
            };
        return {
            getUserService : getUserService
        }
    })();

exports.services = services;