const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const { MenuItem } = require('electron')

const packageJson = require('./package.json');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('Auto Updater Starting.');

class AutoUpdater {
    constructor() {
        autoUpdater.on('checking-for-update', () => {
            log.info(`checking for update. Current version: ${packageJson.version}`);
        })

        autoUpdater.on('update-available', (ev, info) => {
            log.info('update available!')
        })

        autoUpdater.on('update-not-available', (ev, info) => {
            log.info('update not available. This is the latest version!')
        })

        autoUpdater.on('error', (ev, err) => {
            log.info('Something went wrong when trying to update the app...', err);
        })

        autoUpdater.on('download-progress', (progressObj) => {
            log.info(`Downloading update...`)
        })

        autoUpdater.on('update-downloaded', (ev, info) => {
            log.info('Update downloaded! Quitting to reinstall.');
            autoUpdater.quitAndInstall();  
        });
    }

    get menuItem() {
        autoUpdater.checkForUpdates();

        return new MenuItem({
            label: `Version ${packageJson.version}`
        })
    }
}

module.exports = AutoUpdater;