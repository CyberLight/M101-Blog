var random = require('../../node_modules/secure_random'),
    Utils = require('../../lib/utils/utils').Utils,
    crypto = require('crypto');

function PasswordManager(){    
    var STR_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",        
        makeSalt = function(cb){
            var salt = '';
            Utils.asyncLoop({
                length : 5, 
                functionToLoop : function(loop, i){
                    random.getRandomInt(0, 51, function(err, value){
                        salt += STR_CHARS[value];
                        loop();
                    });
                },
                callback : function(){
                    cb(null, salt);
                }
            });
        },
        makePasswordHash = function(passtext, vsalt, cb){
            var signer = crypto.createHmac('sha256', new Buffer('My$uP#r$3cUREk3Y', 'utf8')),
                result = '';                
              
              if(vsalt){
                result = signer.update(passtext + vsalt).digest('hex') + ',' + vsalt;            
                cb(null, result);
              }else{                
                makeSalt(function(err, salt){
                  result = signer.update(passtext + salt).digest('hex') + ',' + salt;            
                  cb(null, result);
                });
              }
        };
    return {
        makeSalt : makeSalt,
        makePasswordHash : makePasswordHash
    }
}

exports.PasswordManager = PasswordManager;
