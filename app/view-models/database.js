var Vue = require("vue"),
    MongoClient = require('mongodb').MongoClient;

var databaseVM = new Vue({
    el : "#server-status",
    created : function(){
        //for complex objects, use created hook to make properties non-reactive
        this.db = null;
    },
    data : {
        serverStatus : null
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
                vm.db = mongoDb;
            });
        },
        getDatabases : function(){
            // Use the admin database for the operation
            var adminDb = this.db.admin();
            // List all the available databases
            adminDb.listDatabases(function(err, databases) {
              console.log(databases);
            });
        },
        showConnectionErrors : function(err){
            console.error("[ERROR]", err);
        },
        closeConnection : function(){
            this.db.close();
        },
        getServerStatus : function(){
            var adminDb = this.db.admin();
            var vm = this;
            adminDb.serverStatus(function(err, status){
                vm.serverStatus = JSON.stringify(status, null, '  ');
            });
        }
    }
});