const mojangjs = require('mojangjs');
const request = require('request');


const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
  win.removeMenu()
}

app.whenReady().then(createWindow)

var names = ['ewbae'];
var uuids = [];
