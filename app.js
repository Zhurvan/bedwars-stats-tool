const { app, BrowserWindow, globalShortcut } = require('electron');
let win;
function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadFile('./public/index.html');
}

function focusWindow() {
    win.focus();
}

app.whenReady().then(() => {
    createWindow();
});

app.on('ready', () => {
   globalShortcut.register('CmdOrCtrl+Shift+1', focusWindow);
});