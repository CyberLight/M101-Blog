var crypto = require('crypto');

function HashMgr(algo){
    var algType = algo || 'sha256';
        getHash = function(text){
            var signer = crypto.createHash(algType);            
            return signer.update(text).digest('hex');
        };
    return {
        getHash : getHash
    }
}

exports.HashMgr = HashMgr;