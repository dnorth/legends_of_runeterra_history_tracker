const { app, Tray, Menu, BrowserWindow } = require('electron')
const simpleLoRServer = require('./server')

const LorStatusChecker = require('./StatusChecker');
const { getPath } = require('./utils');

const lorTrayIcon = getPath('/resources/lor_icon_24x24.png');

const getNewContextMenu = (status, statusLabel) => {
    const newContextMenu = Menu.buildFromTemplate([
        LorStatusChecker.menuItem,
        {
            label: 'kekw',
        },
        {
            label: 'Quit',
            click: app.quit
        }
    ]);

    return newContextMenu;
}

app.whenReady().then(() => {
    let win = new BrowserWindow({ show: false });
    appTray = new Tray(lorTrayIcon);

    appTray.setToolTip('Runeterra Win Tracker');
    appTray.setContextMenu(getNewContextMenu());

    appTray.on('click', () => {
        appTray.popUpContextMenu(getNewContextMenu());
    })
})