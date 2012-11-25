var MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    Interface = require("..//lib/interfaces/interface").jspatterns.contracts.Interface,
	should = require("should"),
    mDbUnitExport = null,
    mDbUnitImport = null;

describe("Mongo Db Unit Tests",function(){
    before(function(){
        mDbUnitExport = new MdbUnit.Export();
        mDbUnitImport = new MdbUnit.Import();
    });
	describe("using mongoExport", function(){
		it("should created successfully", function(){			
			should.exist(mDbUnitExport);
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
        
       describe("fluent interface implementation checking", function(){
            it("should implement IExportInterface and not throw exception", function(){
                var exportInterface = new Interface("IExportInterface", ['setHost', 'setPort', 'setDb', 'exportData', 'getOptions']);
                (function(){
                    Interface.ensureImplements(mDbUnitExport, exportInterface);
                }).should.not.throw();
            });
            
            it("should 'setHost()' return object of ISetHostExportInterface", function(){
                var exportInterface = new Interface("ISetHostExportInterface", ['setPort', 'setDb', 'exportData']);
                (function(){
                    Interface.ensureImplements(mDbUnitExport.setHost(), exportInterface);
                }).should.not.throw();
            });
            
            it("should 'setPort()' return object of ISetPortExportInterface", function(){
                var exportInterface = new Interface("ISetPortExportInterface", ['setDb']);
                (function(){
                    Interface.ensureImplements(mDbUnitExport.setPort(), exportInterface);
                }).should.not.throw();
            });
            
            it("should 'setDb()' return object of ISetDbExportInterface", function(){
                var exportInterface = new Interface("ISetDbExportInterface", ['setCollection', 'exportData']);
                (function(){
                    Interface.ensureImplements(mDbUnitExport.setDb(), exportInterface);
                }).should.not.throw();
            });
            
            it("should 'setCollection()' return object of ISetCollectionExportInterface", function(){
                var exportInterface = new Interface("ISetCollectionExportInterface", ['exportData']);
                (function(){
                    Interface.ensureImplements(mDbUnitExport.setDb().setCollection(), exportInterface);
                }).should.not.throw(); 
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
    
    describe("using mongoimport", function(){
        it("should created sucessfully", function(){
            should.exist(mDbUnitImport);
        });
        
        it("should return default options Object", function(){
            var options = {host:'127.0.0.1', port:27017, drop : false, db : '', collection : ''},
                mDbUnitImportOptions = mDbUnitImport.getOptions();
            
            mDbUnitImportOptions.host.should.be.equal(options.host);
            mDbUnitImportOptions.port.should.be.equal(options.port);
            mDbUnitImportOptions.db.should.be.equal(options.db);
            mDbUnitImportOptions.drop.should.be.equal(options.drop);
            mDbUnitImportOptions.collection.should.be.equal(options.collection);
        });
        
         it("should return options Object with substituted values", function(){
            var options = {host:'localhost', port:28520, db : 'dbTestImport', collection : 'myCollectionImport', drop : true},
                mDbUnitImportOptions = {};
            
            mDbUnitImport.setHost(options.host)
                   .setPort(options.port)
                   .setDb(options.db)
                   .setCollection(options.collection)
                   .setDrop(true);
            
            mDbUnitImportOptions = mDbUnitImport.getOptions();
            
            mDbUnitImportOptions.host.should.be.equal(options.host);
            mDbUnitImportOptions.port.should.be.equal(options.port);
            mDbUnitImportOptions.db.should.be.equal(options.db);
            mDbUnitImportOptions.drop.should.be.equal(options.drop);
            mDbUnitImportOptions.collection.should.be.equal(options.collection);
        });
        
        describe("fluent interface implementation checking", function(){
            it("should implement RootImportInterface and not throw exception", function(){
                var importInterface = new Interface("RootImportInterface", ['setHost', 'setPort', 'setDb', 'importData', 'getOptions']);
                (function(){
                    Interface.ensureImplements(mDbUnitImport, importInterface);
                }).should.not.throw();
            });
            
            it("should 'setHost()' return object of ISetHostImportInterface", function(){
                var importInterface = new Interface("ISetHostImportInterface", ['setPort', 'setDb', 'importData']);
                (function(){
                    Interface.ensureImplements(mDbUnitImport.setHost(), importInterface);
                }).should.not.throw();
            });
            
            it("should 'setPort()' return object of ISetPortImportInterface", function(){
                var importInterface = new Interface("ISetPortImportInterface", ['setDb']);
                (function(){
                    Interface.ensureImplements(mDbUnitImport.setPort(), importInterface);
                }).should.not.throw();
            });
            
            it("should 'setDb()' return object of ISetDbImportInterface", function(){
                var importInterface = new Interface("ISetDbImportInterface", ['setCollection', 'importData']);
                (function(){
                    Interface.ensureImplements(mDbUnitImport.setDb(), importInterface);
                }).should.not.throw();
            });
            
            it("should 'setCollection()' return object of ISetCollectionImportInterface", function(){
                var importInterface = new Interface("ISetCollectionImportInterface", ['setDrop','importData']);
                (function(){
                    Interface.ensureImplements(mDbUnitImport.setDb().setCollection(), importInterface);
                }).should.not.throw(); 
            });
            
            it("should 'setDrop()' return object of ISetDropImportInterface", function(){
                var importInterface = new Interface("ISetDropImportInterface", ['importData']);
                (function(){
                    Interface.ensureImplements(mDbUnitImport.setDb().setCollection().setDrop(), importInterface);
                }).should.not.throw(); 
            });
        });
        
         describe.skip("import data operations", function(){
            describe("real tests", function(){
                it("should import data from file to collection 'scores' of 'test' database", function(done){
                     mDbUnitImport.setDb("test").setCollection("scores").setDrop(true).importData(".\\tests_outdir\\scores.json",function(exit_code){
                        should.exist(exit_code);
                        exit_code.should.be.equal(0);
                        done();
                     });
                });
            });
        });
    });
});
