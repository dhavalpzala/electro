var Vue = require("vue");
var database = {};
var loginVM = new Vue({
    el : "body",
    data : {
        host : "127.0.0.1", // default Values
        port : "27017", // default Values
        username : "",
        password : "",
        database : ""
    },
    methods : {
        login : function(e){
            var url = this.getConnectionUrl();
            databaseVM.connect(url);
        },
        getConnectionUrl : function(){
            return "mongodb://"+this.$data.host + ":"+ this.$data.port;
        }
    }
});