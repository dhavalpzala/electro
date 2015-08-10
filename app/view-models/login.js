var Vue = require("vue");
var dbClient = new Database();
var loginVM = new Vue({
    el: "body",
    data: {
        host: "127.0.0.1", // default Values
        port: "27017", // default Values
        username: "",
        password: "",
        database: "",
        isloggedin: false,
        loginError: false,
        databases: [],
        collections: [],
        records: [],
        newdb: '',
        newCollectionName: '',
        collectioName1: '',
        record: '',
        currentDb: '',
        currentCollection: ''
    },
    methods: {
        login: function(e) {
            e.preventDefault();
            var url = this.getConnectionUrl(),
                vm = this;
            //databaseVM.connect(url, this.$data);
            dbClient.connect(url).then(function(){
                vm.isloggedin = true;
                vm.getDatabases();
            });
        },
        getConnectionUrl: function() {
            return "mongodb://" + this.$data.host + ":" + this.$data.port;
        },
        getDatabases: function(){
            var vm = this;
            dbClient.getDatabases().then(function(dbs){
                vm.databases = dbs;
            });
        },
        getCollections: function(dbName) {
            // this.$data.currentDb = name;
            // this.$data.currentCollection = '';
            // databaseVM.getCollection(name);
            var vm = this;
            dbClient.useDatabase(dbName);
            dbClient.getCollections().then(function(collections){
                vm.collections = collections;
            });
        },
        useDatabase: function(dbName){
            dbClient.useDatabase(dbName);
        },
        getRecords: function(collectionName) {
            // this.$data.currentCollection = name;
            // databaseVM.getRecords(name);
            var vm = this;
            dbClient.getRecords(collectionName).then(function(records){
                vm.records = records;
            });
        },
        stringifyRecord: function(r) {
            return JSON.stringify(r, null, "  ");
        },
        addDb: function(e) {
            e.preventDefault();
            //databaseVM.addDatabase(this.$data.newdb, this.$data.newCollectionName);
            dbClient.addDatabase(this.$data.newdb);
        },
        addCollection: function(e) {
            e.preventDefault();
            dbClient.addDatabase(this.$data.newCollectionName);
            //databaseVM.addCollection(this.$data.collectioName1);
        },
        addDbAndCollection: function(e){
             e.preventDefault();
            var vm = this;
            vm.addDb(e);
            vm.useDatabase(this.$data.newdb);
            vm.addCollection(e);
        },
        dropDatabase: function(name) {
            dbClient.dropDatabase(name);
            this.getDatabases();
        },
        dropCollection: function(name) {
            dbClient.dropCollection(name);
            this.getCollections();
        },
        addRecord: function(e) {
            e.preventDefault();
            dbClient.addRecord(JSON.parse(this.$data.record));
        }
    }
});