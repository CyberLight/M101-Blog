var spawn = require('child_process').spawn;    

function MdbUnit(){
	var host = "127.0.0.1",
        port = 27017,
        collection = "",
        db = "",
        mapExportOptions = {
            "host" : "--host",
            "port" : "--port",
            "db" : "--db",
            "collection" : "--collection"
        },
        constructParams = function(outPath){
           var processParams = [],
               options = getOptions(),
               mongoexport = null;
           
           for(var option in options){              
              if(mapExportOptions.hasOwnProperty(option)){ 
                 var optVal = options[option];
                 if(optVal){
                    processParams.push(mapExportOptions[option]);
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
                host : host || "127.0.0.1",
                port : port || 27017,
                db : db,
                collection : collection
            };
        },
        exportData = function(outPath, cb){
            
            var spawnOptions = constructParams(outPath),
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
        mongoExport : {
            setHost : setHost,
            exportData : exportData,
            getOptions : getOptions,
            setDb : setDb
        }
    }
}


exports.MdbUnit = MdbUnit;