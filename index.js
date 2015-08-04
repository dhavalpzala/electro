var app = require('app'),
    BrowserWindow = require('browser-window');

app.on('ready', function(){
  var mainWindow = new BrowserWindow({
    fullscreen:true,
    center:true,
    icon :"img/mviewer.png",
    title : app.getName()
  });
  mainWindow.loadUrl("file://"+ __dirname + "/login.html");
})