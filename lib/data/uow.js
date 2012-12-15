var Repository = require("../repositories/repository").Repository;

function UoW(dbv){
    var db = dbv,
        setDb = function(repo){
            repo.setDb(db);
        },
        
        //Repositories
        users = new Repository('users'),
        posts = new Repository('posts'),
        
        //Repositories getters
        getUsers = function(){
            setDb(users);
            return users;
        },
        getPosts = function(){
            setDb(posts);
            return posts;
        };
    return{
        users : getUsers,
        posts : getPosts
    }
}

exports.UoW = UoW;