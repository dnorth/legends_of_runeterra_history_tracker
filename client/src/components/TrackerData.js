import { v4 as uuidv4 } from 'uuid';

import ClientHistoryRecord from './ClientHistoryRecord'

export default class TrackerData {
    constructor(history = []) {
        this.history = history.map(record => new ClientHistoryRecord(record));
    }

    get history() {
        return this._history;
    }

    set history(newFullHistory) {
        this._history = newFullHistory.map(record => new ClientHistoryRecord(record));
    }

    get wins() {
        return this.history.filter(item => item.localPlayerWon === true).length
    }

    get losses() {
        return this.history.filter(item => item.localPlayerWon === false).length
    }
}