'use strict'

const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const github = require('./github')

let mainWindow
let config = {}


if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = true
  config.url = `file://${__dirname}/dist/index.html`
}


function createWindow () {

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 400,
    width: 400,
    titleBarStyle: 'hidden-inset',
    frame: false,
    animate: true,
    acceptFirstMouse: true
  })

  mainWindow.loadURL(config.url)

  /*
   * Devtron setup
   */
  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => mainWindow.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }

  /*
   * Get access
   */
  ipc.on('getAccess', () => {
    github.auth(mainWindow);
  });

  ipc.on('resize', function (e, x, y) {
    mainWindow.setSize(x, y)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
