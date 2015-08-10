var Vue = require("vue"),
    MongoClient = require('mongodb').MongoClient;

var databaseVM = new Vue({
    el: "#server-status",
    created: function() {
        //for complex objects, use created hook to make properties non-reactive
        this.db = null;
        this.currentDb = null;
        this.currentCollection = null;
    },
    data: {
        serverStatus: null
    },
    methods: {
        connect: function(url) {
            var vm = this;

            MongoClient.connect(url, function(err, mongoDb) {

                //error handling
                if (err) {
                    loginVM.loginError = true;
                    vm.showConnectionErrors(err);
                    return;
                }
                //setting up db instance
                vm.db = mongoDb;
                loginVM.isloggedin = true;
                vm.getDatabases();
            });
        },
        getDatabases: function() {
            // Use the admin database for the operation
            var adminDb = this.db.admin();
            // List all the available databases
            adminDb.listDatabases(function(err, dbs) {
                if (err) {
                    vm.showConnectionErrors(err);
                    return;
                }
                loginVM.databases = dbs.databases;
            });
        },
        getCollection: function(name) {
            var vm = this;
            vm.currentDb = vm.db.db( name );
            loginVM.records = [];
            vm.currentDb.collections(function(err, cols) {
                if (err) {
                    vm.showConnectionErrors(err);
                    return;
                }
                loginVM.collections = [];
                for (var i in cols) {
                    var colName = cols[i].collectionName;
                    if (colName !== 'system.indexes' && colName !== 'system.users') {
                        loginVM.collections.push({
                            collectionName: colName
                        })
                    }
                }
            });
        },
        getRecords: function(name ) {
            var vm = this;
            vm.currentCollection = vm.currentDb.collection( name );
            vm.currentCollection.find(function(err, rec) {
                if (err) {
                    vm.showConnectionErrors(err);
                    return;
                }
                loginVM.records = [];
                rec.forEach(function(doc) {
                    loginVM.records.push({
                        record: doc
                    });
                })
            });
        },
        showConnectionErrors: function(err) {
            console.error("[ERROR]", err);
        },
        closeConnection: function() {
            this.db.close();
        },
        getServerStatus: function() {
            var adminDb = this.db.admin();
            var vm = this;
            adminDb.serverStatus(function(err, status) {
                vm.serverStatus = JSON.stringify(status, null, '  ');
            });
        },
        addDatabase : function  ( dbname, collectionName ) {
            var vm = this;
            var db = vm.db;
            db.createCollection( collectionName, function(err, collection){
               if (err) {
                    vm.showConnectionErrors(err);
                    return;
                }
                vm.getDatabases();
                console.log("Created testCollection");
                console.log(collection);
            });
        },
        addCollection: function  ( collectionName ) {
            var vm = this;
            var dbname = vm.currentDb.databaseName;
            vm.currentDb.createCollection( collectionName, function(err, collection){
               if ( err ) {
                    vm.showConnectionErrors(err);
                    return;
                }
                vm.getCollection( dbname );
                
            });

        },
        
        dropDatabase: function( name ) {
            var vm = this;
            var targetdb = vm.db.db( name );
            
            targetdb.dropDatabase( function  (err, result) {
                if ( err ) {
                    vm.showConnectionErrors(err);
                    return;
                }
                vm.getDatabases( );
            } );

        },
        dropCollection : function( name ) {
            var vm = this;
            var dbname = vm.currentDb.databaseName;
            vm.currentDb.dropCollection( name, function  (err, result) {
                if ( err ) {
                    vm.showConnectionErrors(err);
                    return;
                }
                vm.getCollection( dbname );
            } )           
        },
        addRecord: function ( rec ) {
            var vm = this;
            var collectionName = vm.currentCollection.collectionName;
            vm.currentCollection.insert( rec, function  ( err, count ) {
                if ( err ) {
                    vm.showConnectionErrors(err);
                    return;
                }
                vm.getRecords( collectionName );

            } )
        }

    }
});