const { MenuItem } = require('electron')

const { getPath } = require('./utils');

const statusIconRed = getPath('/resources/status_red_12.png');
const statusIconGreen = getPath('/resources/status_green_12.png');


class LorStatusChecker {
    static status = false;

    static get label() {
        return LorStatusChecker.status ? 'Connected to LoR' : 'Not Connected to LoR';
    }

    static get icon() {
        return LorStatusChecker.status ? statusIconGreen : statusIconRed
    }

    static get menuItem() {
        return new MenuItem({
            label: LorStatusChecker.label,
            icon: LorStatusChecker.icon
        });
    }
}

module.exports = LorStatusChecker;