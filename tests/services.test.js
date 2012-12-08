var Interface = require('../lib/interfaces/interface').jspatterns.contracts.Interface,
    should = require('../node_modules/should'),
    IServices = new Interface('IServices', ['getUserService']),
    services = require('../lib/data/services').services;
    
describe("services tests", function(){
    it("should exist instance of services", function(){
        should.exist(services);
    });
    
    it("should implement IServices interface", function(){
       (function(){
           Interface.ensureImplements(services, IServices);
       }).should.not.throw(); 
    });
    
    it("should return instance of userService", function(done){
        services.getUserService(function(err, userService){
            should.exist(userService);
            done();
        });
    })
});

