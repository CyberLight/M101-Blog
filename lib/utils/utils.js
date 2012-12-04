var Utils = (function(){
    var asyncLoop = function(o){
        var i=-1;

        var loop = function(){
            i++;
            if(i==o.length){o.callback(); return;}
            o.functionToLoop(loop, i);
        } 
        loop();
    }
    
    return {
        asyncLoop : asyncLoop
    }
})()

exports.Utils = Utils;