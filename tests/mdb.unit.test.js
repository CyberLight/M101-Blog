var MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
	should = require("should"),
    mDbUnitExport = null;

describe("Mongo Db Unit Tests",function(){
    before(function(){
        var mdbUnit = new MdbUnit();
        mDbUnitExport = mdbUnit.mongoExport;
    });
	describe("using mongoExport", function(){
		it("should created successfully", function(){			
			should.exist(mDbUnitExport);
		});		

		it("should has 'setHost' method", function(){			
			mDbUnitExport.should.have.property("setHost");
		});
        
        it("should has 'exportData' method", function(){
            mDbUnitExport.should.have.property("exportData");
        });
        
        it("should has 'getOptions' method", function(){            
            mDbUnitExport.should.have.property("getOptions");
        });
        
        it("should return default options Object", function(){
            var options = {host:'127.0.0.1', port:27017, db : '', collection : ''},
                mDbUnitExportOptions = mDbUnitExport.getOptions();
            
            mDbUnitExportOptions.host.should.be.equal(options.host);
            mDbUnitExportOptions.port.should.be.equal(options.port);
            mDbUnitExportOptions.db.should.be.equal(options.db);
            mDbUnitExportOptions.collection.should.be.equal(options.collection);
        });
        
        it("should return options Object with substituted values", function(){
            var options = {host:'localhost', port:36520, db : 'dbTest1', collection : 'myCollection'},
                mDbUnitExportOptions = {};
            
            mDbUnitExport.setHost(options.host)
                   .setPort(options.port)
                   .setDb(options.db)
                   .setCollection(options.collection);
            
            mDbUnitExportOptions = mDbUnitExport.getOptions();
            
            mDbUnitExportOptions.host.should.be.equal(options.host);
            mDbUnitExportOptions.port.should.be.equal(options.port);
            mDbUnitExportOptions.db.should.be.equal(options.db);
            mDbUnitExportOptions.collection.should.be.equal(options.collection);
        });
        
        describe("fluent interface methods", function(){
            it("should has 'exportData' method after calling 'setHost'", function(){                
                mDbUnitExport.setHost().should.have.property("exportData");
            });
            
            it("should has 'setPort' method after calling 'setHost()'", function(){                
                mDbUnitExport.setHost().should.have.property("setPort");
            });
            
            it("should has 'setDb' method after calling 'setHost()'", function(){
                mDbUnitExport.setHost().should.have.property("setDb");
            });
            
            it("should has 'exportData' method after calling 'setDb()'", function(){                
                mDbUnitExport.setHost().setDb().should.have.property("exportData");
            });
            
            it("should has 'setCollection' method after calling 'setDb()'", function(){                
                mDbUnitExport.setHost().setDb().should.have.property("setCollection");
            });
            
            it("should has 'setDb' method after calling 'setPort()'", function(){                
                mDbUnitExport.setHost().setPort().should.have.property("setDb");
            });
            
            it("should has 'exportData' method after calling 'setCollection()'", function(){                
                mDbUnitExport.setHost().setPort().setDb().setCollection().should.have.property("exportData");
            });
        });
        
        describe.skip("export data operations", function(){
            describe("real tests", function(){
                it("should export data from collection 'scores' of 'test' database", function(done){
                     mDbUnitExport.setDb("test").setCollection("scores").exportData(".\\tests_outdir\\scores.json",function(exit_code){
                        should.exist(exit_code);
                        exit_code.should.be.equal(0);
                        done();
                     });
                });
            });
        });
	});	
});
