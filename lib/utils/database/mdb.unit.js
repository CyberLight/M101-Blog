var spawn = require('child_process').spawn;    

function ExportMdbUnit(){
	 var DEFAULT_HOST = "127.0.0.1",
        DEFAULT_PORT = 27017,
        host = DEFAULT_HOST,
        port = DEFAULT_PORT,
        collection = "",
        db = "",
        mapOptions = {
            "host" : "--host",
            "port" : "--port",
            "db" : "--db",
            "collection" : "--collection"
        },
        constructParams = function(outPath, options, optionsMap){
           var processParams = [],               
               mongoexport = null;
           
           for(var option in options){              
              if(optionsMap.hasOwnProperty(option)){ 
                 var optVal = options[option];
                 if(optVal){
                    processParams.push(optionsMap[option]);
                    processParams.push(options[option]);
                 }
              }
           }
           
           processParams.push("--out");
           processParams.push(outPath);
           
           return processParams;
        },
        getOptions = function(){
            return {
                host : host || DEFAULT_HOST,
                port : port || DEFAULT_PORT,
                db : db,
                collection : collection
            };
        },        
        exportData = function(outPath, cb){
            var spawnOptions = constructParams(outPath, getOptions(), mapOptions),
                me = null;
                
            me = spawn('mongoexport', spawnOptions);
            
            me.stdout.on('data', function (data) {
                console.log(data.toString());
            });
            
            me.stderr.on('data', function (data) {
                console.log(data.toString());
            });
            
            me.on('exit', function (code) {
                cb(code);
            });
        },      
        setPort = function(portv){
            port = portv;
            return {
                setDb : setDb
            }
        },
        setCollection = function(colv){
            collection = colv;
            return {
                exportData : exportData
            }
        },       
        setDb = function(dbv){
            db= dbv;
            return {
                exportData : exportData,
                setCollection : setCollection
            }
        },       
        setHost = function(hostv){
            host  = hostv;
            return {
                exportData : exportData,
                setPort : setPort,
                setDb : setDb
            }
        };       
    
    return {      
        setHost : setHost,
        setPort : setPort,
        setDb : setDb,
        exportData : exportData,
        getOptions : getOptions    
    }
}


function ImportMdbUnit(){
    var DEFAULT_HOST = "127.0.0.1",
        DEFAULT_PORT = 27017,
        host = DEFAULT_HOST,
        port = DEFAULT_PORT,
        collection = "",
        db = "",
        drop = false,
        mapOptions = {
            "host" : "--host",
            "port" : "--port",
            "db" : "--db",            
            "collection" : "--collection"
        },
        constructParams = function(outPath, options, optionsMap){
           var processParams = [],               
               mongoexport = null;
           
           for(var option in options){              
              if(optionsMap.hasOwnProperty(option)){ 
                 var optVal = options[option];
                 if(optVal){
                    processParams.push(optionsMap[option]);
                    processParams.push(options[option]);
                 }
              }
           }
           
           if(drop)
              processParams.push("--drop");
           
           processParams.push("--file");
           processParams.push(outPath);
           
           return processParams;
        },       
        getOptions = function(){
            return {
                host : host || DEFAULT_HOST,
                port : port || DEFAULT_PORT,
                db : db,
                drop : drop,
                collection : collection
            };
        },       
        importData = function(file, cb){
            var spawnOptions = constructParams(file, getOptions(), mapOptions),
                me = null;
                
            me = spawn('mongoimport', spawnOptions);
            
            me.stdout.on('data', function (data) {
                console.log(data.toString());
            });
            
            me.stderr.on('data', function (data) {
                console.log(data.toString());
            });
            
            me.on('exit', function (code) {
                cb(code);
            });
        },
        setPort = function(portv){
            port = portv;
            return {
                setDb : setDb
            }
        },        
        setDrop = function(dropv){
            drop = dropv;
            return {
                importData: importData
            }
        },
        setCollection = function(colv){
            collection = colv;
            return {
                setDrop : setDrop,
                importData : importData
            }
        },        
        setDb = function(dbv){
            db= dbv;
            return {
                importData : importData,
                setCollection : setCollection
            }
        },       
        setHost = function(hostv){
            host  = hostv;
            return {
                importData : importData,
                setPort : setPort,
                setDb : setDb
            }
        };
    
    return {               
        setHost : setHost,
        setPort : setPort,
        setDb : setDb,
        importData : importData,
        getOptions : getOptions       
    }
}

exports.MdbUnit = {
    Export : ExportMdbUnit,
    Import : ImportMdbUnit
};