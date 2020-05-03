const { app, Tray, Menu, BrowserWindow } = require('electron')

const LorStatusChecker = require('./StatusChecker');
const simpleLoRServer = require('./server')

const { getPath } = require('./utils');

const lorTrayIcon = getPath('/resources/lor_icon_24x24.png');

const getNewContextMenu = (status, statusLabel) => {
    const newContextMenu = Menu.buildFromTemplate([
        {
            label: 'Legends of Runeterra Win Tracker',
        },
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

app.whenReady().then(() => {
    const appTray = new Tray(lorTrayIcon);

    appTray.setToolTip('Runeterra Win Tracker');

    appTray.on('click', () => {
        appTray.popUpContextMenu(getNewContextMenu());
    });

    appTray.on('right-click', () => {
        appTray.popUpContextMenu(getNewContextMenu());
    });
})