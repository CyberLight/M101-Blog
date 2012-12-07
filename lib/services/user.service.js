var utils = require('../utils/utils').Utils;

function UserService(pUoW, passwordManager){
    var uow = pUoW,
        pm = passwordManager,
        createUser = function(user, cb){            
            pm.makePasswordHash(user.password, null, function(err, hash){
                var userForInsert = utils.simpleClone(user);
                userForInsert.password = hash;
                uow.users().insert(userForInsert, cb);
            });        
        },
        validateLogin = function(user, cb){
            uow.users().findOne({_id : user._id}, function(err, userFromDb){                                
                if(user){
                   var  passwordParts = userFromDb.password.split(','),
                        passwordSalt = passwordParts[1];                        
                        
                   pm.makePasswordHash(user.password, passwordSalt, function(err, hash){
                       cb(err, hash == userFromDb.password);
                   });
                }
            });
        };
    
    return {
        createUser : createUser,
        validateLogin : validateLogin
    }
}

exports.UserService = UserService;