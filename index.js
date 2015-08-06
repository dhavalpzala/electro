var app = require('app'),
    BrowserWindow = require('browser-window');

app.generalData = {};
app.on('ready', function() {
    var mainWindow = new BrowserWindow({
        center: true,
        icon: "img/mviewer.png",
        title: app.getName()
    });
    mainWindow.loadUrl("file://" + __dirname + "/app/templates/login.html");
})