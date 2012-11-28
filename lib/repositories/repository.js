function Repository(collName){
	var collectionName = collName,        
		db = null,
        getCollection = function(){
            return db.collection(collectionName);
        },
		setDb = function(database){
			db = database;
		},
		getDb = function(){
			return db;
		},
        findOne = function(query, cb){
            getCollection().findOne(query, function(err, item){
                cb(err, item);
                db.close();
            });
        },
        find = function(query, options, cb){            
            getCollection().find(query, options).toArray(cb);
        },
        insert = function(docs, options, cb){            
            getCollection().insert(docs, options, cb);
        },
        remove = function(query, options, cb){
            getCollection().remove(query, options, cb);
        },
        update = function(selector, document, options, cb){
            getCollection().update(selector, document, options, cb);
        },
        count = function(query, options, cb){
            getCollection().count(query, options, cb);
        };
	return {
		collection : collectionName,
		setDb : setDb,
		getDb : getDb,
        findOne : findOne,
        find : find,
        insert : insert,
        remove : remove,
        update : update,
        count : count
	}
}


exports.Repository = Repository;