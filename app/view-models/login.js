var Vue = require("vue");
var database = {};
var loginVM = new Vue({
    el : "body",
    data : {
        host : "127.0.0.1", // default Values
        port : "27017", // default Values
        username : "",
        password : "",
        database : "",
        isloggedin : false,
        loginError: false,
        databases : [],
        collections: [],
        records: []
    },
    methods : {
        login : function(e){
            e.preventDefault();
            var url = this.getConnectionUrl();
            databaseVM.connect( url, this.$data );
        },
        getConnectionUrl : function(){
            return "mongodb://"+this.$data.host + ":"+ this.$data.port;
        },
        getCollection : function  ( name ) {
            databaseVM.getCollection( name );   
        },
        getRecords : function  ( name ) {
            databaseVM.getRecords( name );   
        },
        stringifyRecord: function  ( r ) {
            return JSON.stringify( r );
        }
    }
});