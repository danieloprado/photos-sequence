import * as path from 'path';
import * as url from 'url';

import { BrowserWindow, app } from 'electron';

let mainWindow;
const isDev = (process.env.NODE_ENV || '').trim() === 'development';
const openTerminal = !!(process.env.ELECTRON_OPEN_DEV || '').trim();

init();

function init(): void {
  if (isDev) {
    // tslint:disable-next-line
    require('electron-reload')(__dirname, {
      interval: 3000
    });
  } else {
    const shouldQuit = app.makeSingleInstance(() => {
      if (!mainWindow) return;

      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    });

    if (shouldQuit) {
      app.quit();
      return;
    }
  }

  app.on('ready', createWindow);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow) return;
    createWindow();
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 600,
    icon: __dirname + '/../icons/icon.png'
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  if (isDev || openTerminal) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
