var Repository = require("../repositories/repository").Repository;

function UoW(dbv){
    var db = dbv,
        setDb = function(repo){
            repo.setDb(db);
        },
        
        //Repositories
        users = new Repository('users'),
        
        //Repositories getters
        getUsers = function(){
            setDb(users);
            return users;
        };
    return{
        users : getUsers
    }
}

exports.UoW = UoW;