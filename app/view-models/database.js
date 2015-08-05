var Vue = require("vue"),
    MongoClient = require('mongodb').MongoClient;
var Database = null; // for now, setting it as a global object for write concern issues.
var databaseVM = new Vue({
    data : {
        database : null 
    },
    methods : {
        connect : function(url){
            var vm = this;
            MongoClient.connect(url, function(err, mongoDb){
                //error handling
                if(err){
                    vm.showConnectionErrors(err);
                    return;
                }
                //setting up db instance
                Database = mongoDb;
            });
        },
        getDatabases : function(){
            // Use the admin database for the operation
            var adminDb = Database.admin();
            // List all the available databases
            adminDb.listDatabases(function(err, dbs) {
              console.log(dbs);
            });
        },
        showConnectionErrors : function(err){
            console.error("[ERROR]", err);
        }
    }
});