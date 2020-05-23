const { app, Tray, Menu, BrowserWindow, Point } = require('electron')

const isFirstInstance = app.requestSingleInstanceLock();

const LorStatusChecker = require('./StatusChecker');
const TwitchAuth = require('./twitchAuth/TwitchAuth');

const { getNativeImage } = require('./utils');

const lorTrayIcon = getNativeImage('/resources/lor_semi_transparent_32x32.png');

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

if (isFirstInstance) {
    const simpleLoRServer = require('./server');

    app.whenReady().then(createWindow);
} else {
    app.quit();
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

    tray.setToolTip('Runeterra History Tracker');
    tray.focus();
    tray.popUpContextMenu(getNewContextMenu(), { x: tray.getBounds().x, y: tray.getBounds().y})

    win.on('minimize', () => {});

    tray.on('click', () => {
        tray.popUpContextMenu(getNewContextMenu());
    });

    tray.on('right-click', () => {
        tray.popUpContextMenu(getNewContextMenu());
    });

    app.on('second-instance', () => {
        tray.displayBalloon({
            title: "Oops... Looking for me?",
            content: "The Runeterra History Tracker app is already running in the system tray below."
        })
    })
  }
  
