const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // if you have a preload script
      nodeIntegration: true,
      contextIsolation: false, // be cautious with this line as it can have security implications
    },
  });

  win.loadFile(path.join(__dirname, 'build/index.html'));
}

app.whenReady().then(createWindow);
