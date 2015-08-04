var Vue = require("./node_modules/vue/dist/vue.min.js");
var MongoClient = require('mongodb').MongoClient;
var loginVM = new Vue({
    el : "body",
    data : {
        host : "127.0.0.1",
        port : "27017",
        username : "",
        password : "",
        database : ""
    },
    methods : {
        connect : function(){
            var url = this.getUrl();
            MongoClient.connect(url, function(err, db) {
                // Use the admin database for the operation
                var adminDb = db.admin();
                // List all the available databases
                adminDb.listDatabases(function(err, dbs) {
                  console.log(dbs);
                  db.close();
                });
            });
        },
        getUrl : function(){
            return "mongodb://"+this.$data.host + ":"+ this.$data.port;
        }
    }
});