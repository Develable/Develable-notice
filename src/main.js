const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
require('./ExpressWeb/bin/www');

const settings = require('./settings.json');

let startWindow;
let mainWindow;

function createWindow () {
  startWindow = new BrowserWindow({width:500, height: 500, frame: false, show: false, center: true, resizable: false, opacity: 0.0, alwaysOnTop: true, transparent: true});
  startWindow.setMenuBarVisibility(false);
  mainWindow = new BrowserWindow({width: 1150, height: 630, minWidth: 1150, minHeight: 660, show: false});
  mainWindow.setMenuBarVisibility(false);

  startWindow.setTitle('Develable 통합 공지 시스템');
  mainWindow.setTitle('Develable 통합 공지 시스템');

  startWindow.loadURL(`file://${__dirname}/start.html`);
  mainWindow.loadURL(`http://localhost:${settings.onPort}/`);

  startWindow.once('ready-to-show', () => {
    startWindow.show();
    let totalSteps = 20.0;
    let totalTime = 800.0;
    let currentOpacity = startWindow.getOpacity();
    let fadeinStart = setInterval(() => {
      currentOpacity = currentOpacity + (1.0/totalSteps);
      startWindow.setOpacity(currentOpacity);
      if (currentOpacity >= 1.0) {
        mainWindow.once('ready-to-show', () => { 
          setTimeout(() => {
            let fadeoutStart = setInterval(() => {
              currentOpacity = currentOpacity - (1.0/totalSteps);
              startWindow.setOpacity(currentOpacity);
              if (currentOpacity <= 0.0) {
                startWindow.close();
                mainWindow.show();
                clearInterval(fadeoutStart);
              }
            }, totalTime/totalSteps);
          }, 1000);
        });
        clearInterval(fadeinStart);
      }
    }, totalTime/totalSteps);
  });
  startWindow.on('closed', () => { startWindow = null; });
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});