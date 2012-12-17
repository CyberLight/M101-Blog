M101-Blog
=========

# Structure of blog

* `lib` - folder include libraries requires for blog
   * `lib\data` - contains classes which united all repositories and services classes
   * `lib\interfaces` - contains class which provide checking of interface method implementation
   * `lib\managers` - contains managers classes which provide management of connection with database and etc.
   * `lib\middleware` - contains parts of `app.js` configuration (middlewares, routes, logging and etc).
   * `lib\repositories` - contains universal repository calss
   * `lib\sec` - contains security utilities
   * `lib\services` - contains classes of application services
   * `lib\shared` - contains class for testing purposes which provide functionality for automatic running of `app.js`
   * `lib\utils` - contains utility classes
* `tests` - folder include unit and behavioral tests of blog functionality
* `routes` - folder with controller classes
* `views` - folder include jade templates for rendering pages
* `app.js` - entry point of blog (use `node app.js` command for running post and accessing to it by [http:\\\\localhost:3000](#))

## Requirements

* **Node.js** - v 0.8.15 or later
* **MongoDB** - v 2.2.1 or later

## Instructions

* Requires installing node.js

* After cloning project from repository run `npm install` command which download project dependencies from `npmjs.org`

* For running all tests you can use `run-tests.bat test` ( for Windows users only at current time ).
    * For successfull passing all tests requires running MongoDB daemon instance (or you must run it in console, manually before running all tests).
    * In process of running tests, all data manipulations occur in a database called **M101Test**

## Information
* This blog created using **Test Driven Development** technology and at current time was wrote **109** tests

## Used technologies

*  **cheerio** - very cool html parsed which help me for parsing html markup in tests
* **superagent** - very cool tool for creating different http queries fo testing purposes
* **mocha** - very cool test runner using different notation and very easy to use
* **secure_random** - provide generating real random numbers
* **express** - very powerful tool for creating web applications based on node.js

## Created tools
* In process of development  this blog i created following tools:
    * **MdbUnit** (**/lib/utils/database/mdb.unit.js**) - used like *NDbUnit* for **C#** for export and import data for testing purposes
        * This tool use **mongoimport** and **mongoexport**. Provide fluent imterface for *import* or *export* parameters setting.

* Sample of using *MdbUnitImport*:

```javascript
var MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    mDbImport = new MdbUnit.Import();

mDbImport
       .setDb("test")
       .setCollection("scores")
       .setDrop(true)
       .importData(".\\tests_outdir\\scores.json",function(exit_code){
                        should.exist(exit_code);
                        exit_code.should.be.equal(0);
                        done();
                     });
```
* Sample of using *MdbUnitExport*:

```javascript
var MdbUnit = require("../lib/utils/database/mdb.unit").MdbUnit,
    mDbExport = new MdbUnit.Export();
 mDbExport.setDb(DB_NAME).setCollection(COL_POSTS).exportData(".\\tests_outdir\\posts.json",function(exit_code){
                        should.exist(exit_code);
                        exit_code.should.be.equal(0);
                        done();
                });
```
    
## TODOs

* Create session for user after authentication
* Modernize blog markup
* Add 'like' system for each post entry and for each comment entry
* Add acceptance tests using **Phantom.js**
* Refactor configs and code of blog
* Add `Markdown` support for storing blog posts data

## Special thanks
* **10gen** for providing nice cources for MongoDB developer and DBAs ( **M101** and **M102** )
* **Habrahabr comunity** for providing link to this courses.
* Special thanks to my friend **Creston** for supporting my ideas.

License
=======

(The MIT License)

Copyright (c) 2012 < **cyberlight(at)live.ru** >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
