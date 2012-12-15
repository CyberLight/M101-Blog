var UserService = require('../services/user.service').UserService,
    PostsService = require('../services/posts.service').PostsService,
    mongodb = require('../../node_modules/mongodb'),
    ClientManager = require('../managers/client.manager').ClientManager,
    PasswordManager = require('../sec/passmgr').PasswordManager,
    HashMgr = require("../utils/hashmgr").HashMgr,
    UoW = require('./uow').UoW,
    config = require('../../package.json').publicConfig,
    services = (function(){    
        var clientManager = new ClientManager(config),           
            userServiceInstance = null,  
            postServiceInsance = null,
            
            getUserService = function(cb){    
                clientManager.getDb(function(err, db){
                    userServiceInstance = new UserService(new UoW(db), new PasswordManager())
                    cb(err, userServiceInstance);
                });
            };
            
            getPostsService = function(cb){
                clientManager.getDb(function(err, db){
                    postServiceInsance = new PostsService(new UoW(db), new HashMgr('md5'))
                    cb(err, postServiceInsance);
                });
            };
        return {
            getUserService : getUserService,
            getPostsService : getPostsService
        }
    })();

exports.services = services;