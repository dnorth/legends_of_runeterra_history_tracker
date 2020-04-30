const { app, BrowserWindow } = require('electron')
const simpleLoRServer = require('./server')

app.whenReady().then(() => {
    let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true
    }
    })

    win.loadURL('http://localhost:5000/')
})