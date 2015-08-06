var Vue = require("vue");
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
            var url = this.getConnectionUrl();
            databaseVM.connect(url, this.$data);
        },
        getConnectionUrl: function() {
            return "mongodb://" + this.$data.host + ":" + this.$data.port;
        },
        getCollection: function(name) {

            this.$data.currentDb = name;
            this.$data.currentCollection = '';
            databaseVM.getCollection(name);
        },
        getRecords: function(name) {

            this.$data.currentCollection = name;
            databaseVM.getRecords(name);

        },
        stringifyRecord: function(r) {
            return JSON.stringify(r, null, "  ");
        },
        addDb: function(e) {
            e.preventDefault();
            databaseVM.addDatabase(this.$data.newdb, this.$data.newCollectionName);
        },
        addCollection: function(e) {
            e.preventDefault();
            databaseVM.addCollection(this.$data.collectioName1);
        },
        dropDatabase: function(name) {
            databaseVM.dropDatabase(name);
        },
        dropCollection: function(name) {
            databaseVM.dropCollection(name);
        },
        addRecord: function(e) {

            e.preventDefault();
            databaseVM.addRecord(JSON.parse(this.$data.record));
        }
    }
});