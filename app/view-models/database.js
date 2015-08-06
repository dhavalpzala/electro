var Vue = require("vue"),
    MongoClient = require('mongodb').MongoClient
    ;

var Database = null; 
var currentDb = null;
var databaseVM = new Vue( {
    data : {
        database : null 
    },
    methods : {
        connect : function(url){
            var vm = this;

            MongoClient.connect(url, function( err, mongoDb ) {
              
                //error handling
                if( err ) {
                    loginVM.loginError = true; 
                    vm.showConnectionErrors(err);
                    return;
                }
                loginVM.isloggedin = true;
                Database = mongoDb;
                vm.getDatabases();

            });
        },
        getDatabases : function(){
            
            var vm = this;
            var adminDb = Database.admin();
            adminDb.listDatabases(function(err, dbs) {
              if( err ) {
                vm.showConnectionErrors(err);
              }
              loginVM.databases = dbs.databases;
            });

        },
        getCollection : function( name ) {
            
            var vm = this;
            currentDb = Database.db( name );
            loginVM.records = [];
            currentDb.collections( function (err, cols ) {
                if( err ) {
                    vm.showConnectionErrors(err);
                    return;
                }
                loginVM.collections = [];
                for( var i in cols ) {
                    var colName = cols[ i ].collectionName;
                    if( colName !== 'system.indexes' && colName !== 'system.users'  ) {

                        loginVM.collections.push( {
                            collectionName:  colName
                        } )

                    } 
                    
                }
            });
        },
        getRecords : function( name ) {
            
            currentDb.collection( name ).find( function( err, rec ) {
                if( err ) {
                    vm.showConnectionErrors(err);
                    return;   
                } 
                loginVM.records = [];   
                rec.forEach( function( doc ) {
                    loginVM.records.push( {
                        record: doc
                    } );    
                } )
                
            } );

        },
        showConnectionErrors : function(err){
            
            console.error("[ERROR]", err);

        }
    }
});