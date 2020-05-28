const { MenuItem } = require('electron')
const { autoUpdater } = require("electron-updater");
const { getNativeImage } = require('./utils');

const statusIconRed = getNativeImage('/resources/status_red_12.png');
const statusIconGreen = getNativeImage('/resources/status_green_12.png');


class LoRStatusChecker {
    static status = false;

    static get label() {
        return LoRStatusChecker.status ? 'Connected to LoR' : 'Not Connected to LoR';
    }

    static get icon() {
        return LoRStatusChecker.status ? statusIconGreen : statusIconRed
    }

    static get menuItem() {
        return new MenuItem({
            label: LoRStatusChecker.label,
            icon: LoRStatusChecker.icon
        });
    }

    static setStatus(newStatus) {
        if (newStatus !== LoRStatusChecker.status) {
            LoRStatusChecker.status = newStatus;
            autoUpdater.checkForUpdates();
        }
    }
}

module.exports = LoRStatusChecker;