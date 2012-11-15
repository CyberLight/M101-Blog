var express = require('../../node_modules/express')

module.exports = function(app, config){
	app.configure('development', function(){
	  app.use(express.errorHandler());
	});
}