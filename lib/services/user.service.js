var utils = require('../utils/utils').Utils;

function UserAlreadyExistError(key, code){
    this.message = "User "+key+" already exists";
    this.code = code;
    this.name = "UserAlreadyExistError";
}

function InvalidLoginError(){
    this.message = "Invalid Login";
    this.code = 0;
    this.name = "InvalidLoginError";
}

UserAlreadyExistError.prototype = Error;
InvalidLoginError.prototype = Error;

function UserService(pUoW, passwordManager){
    var MDB_DUP_KEY_ERRCODE = 11000,
        uow = pUoW,
        pm = passwordManager,
        createUser = function(user, cb){            
            pm.makePasswordHash(user.password, null, function(err, hash){
                var userForInsert = utils.simpleClone(user);
                userForInsert.password = hash;
                uow.users().insert(userForInsert, function(err, users){
                    if(err && err.code == MDB_DUP_KEY_ERRCODE){
                        var matches = err.message.match(/\"(.*)\"/i);
                        err = new UserAlreadyExistError(matches[0], err.code);                        
                    }
                    cb(err, users);
                });
            });        
        },
        validateLogin = function(user, cb){
            uow.users().findOne({_id : user._id}, function(findErr, userFromDb){                                
                if(userFromDb){
                   var  passwordParts = userFromDb.password.split(','),
                        passwordSalt = passwordParts[1];                        
                        
                   pm.makePasswordHash(user.password, passwordSalt, function(err, hash){
                       cb(findErr, hash == userFromDb.password);
                   });
                }else{
                    findErr = new InvalidLoginError();
                    cb(findErr, false);
                }
            });
        };
    
    return {
        createUser : createUser,
        validateLogin : validateLogin
    }
}

exports.UserService = UserService;