function Repository(collName){
	var collectionName = collName,        
		db = null,
		setDb = function(database){
			db = database;
		},
		getDb = function(){
			return db;
		},
        findOne = function(query, cb){
            var collection = db.collection(collectionName);           
            collection.findOne(query, function(err, item){
                cb(err, item);
                db.close();
            });
        };
	return {
		collection : collectionName,
		setDb : setDb,
		getDb : getDb,
        findOne : findOne
	}
}


exports.Repository = Repository;