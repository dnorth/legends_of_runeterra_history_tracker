const { app, Tray, Menu, BrowserWindow } = require('electron')

const LorStatusChecker = require('./StatusChecker');
const TwitchAuth = require('./twitchAuth/TwitchAuth');
const simpleLoRServer = require('./server')

const { getPath } = require('./utils');

const lorTrayIcon = getPath('/resources/lor_icon_24x24.png');

const getNewContextMenu = (status, statusLabel) => {
    const newContextMenu = Menu.buildFromTemplate([
        {
            label: 'Legends of Runeterra History Tracker',
        },
        TwitchAuth.menuItem,
        ...TwitchAuth.logoutMenuItem,
        LorStatusChecker.menuItem,
        {
            label: 'Version 0.1.0',
        },
        {
            label: 'Quit',
            click: app.quit
        }
    ]);

    return newContextMenu;
}


function createWindow () {
    let tray = new Tray(lorTrayIcon);

    let win = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })

    win.on('minimize',function(event){
        tray.setToolTip('Runeterra Win Tracker');

    });

    tray.on('click', () => {
        tray.popUpContextMenu(getNewContextMenu());
    });

    tray.on('right-click', () => {
        tray.popUpContextMenu(getNewContextMenu());
    });
  }
  
  app.whenReady().then(createWindow)