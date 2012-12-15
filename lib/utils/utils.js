var Utils = (function(){
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
       };
    
    return {
        asyncLoop : asyncLoop,
        simpleClone : simpleClone,
        deepClone : deepClone,
        toIsoDate : toIsoDate
    }
})()

exports.Utils = Utils;