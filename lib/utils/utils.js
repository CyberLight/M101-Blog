var fs = require("fs"), 
Utils = (function(){
    var asyncLoop = function(o){
            var i=-1;

            var loop = function(){
                i++;
                if(i==o.length){o.callback(); return;}
                o.functionToLoop(loop, i);
            } 
            loop();
        },
        simpleClone = function (obj) {
             // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;
            //Simple clonin of object
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        },
        deepClone = function (obj) {
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                var copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                var copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = deepClone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                var copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
                }
                return copy;
            }

            throw new Error("Unable to copy obj! Its type isn't supported.");            
        },
        toIsoDate = function(d){
            function pad(n) { return n < 10 ? '0' + n : n }
            return 'ISODate("' + d.getUTCFullYear() + '-'
                + pad(d.getUTCMonth() + 1) + '-'
                + pad(d.getUTCDate()) + 'T'
                + pad(d.getUTCHours()) + ':'
                + pad(d.getUTCMinutes()) + ':'
                + pad(d.getUTCSeconds()) + 'Z'+'")';
       }, genGuid = function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);
            });
       },
       format = function(){
              var formatArgs = arguments,
                  formatStr = formatArgs[0];
                  
              return formatStr.replace(/\{(\d+)\}/g, function(match, number) { 
                var index = Number(number) + 1;
                return (typeof formatArgs[index] != 'undefined' ? formatArgs[index] : match);
              });
       },
       toBase64 = function(str){
           return new Buffer(str).toString('base64').replace(/\=/g, '');
       },
       fromBase64 = function(b64Str){
           return new Buffer(b64Str, 'base64').toString('utf8');
       },
	   replaceCrLf = function(data, subStr){
			return data.replace(/(\r\n|\n|\r)/gm, subStr);
	   },
	   readFile = function(path, cb){
			fs.readFile(path, function(err, data){
				if(err)
					throw err;
				cb(data.toString());
			});
	   };
    
    return {
        asyncLoop : asyncLoop,
        simpleClone : simpleClone,
        deepClone : deepClone,
        toIsoDate : toIsoDate,
        genGuid : genGuid,
        format : format,
        toBase64 : toBase64,
        fromBase64 : fromBase64,
		replaceCrLf : replaceCrLf,
		readFile : readFile
    }
})()

exports.Utils = Utils;