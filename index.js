const mojangjs = require('mojangjs');
const request = require('request');


const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.

  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  win.loadFile('index.html')
  win.removeMenu()
}



app.whenReady().then(createWindow)



var names = ['ewbae'];
var uuids = [];
