import { v4 as uuidv4 } from 'uuid';

import ClientHistoryRecord from './ClientHistoryRecord'

const detectProbableError = (history) => {
    const [lastMatch, ...remainingMatches] = history;

    if(!lastMatch) {
        return history;
    }

    //If there are more than 1 records and a records besides the most recent doesn't say whether the local player won, there's probably an error.
    return [lastMatch, ...remainingMatches.map(record => record.localPlayerWon === null ? { ...record, probableError: true } : record)];
}

export default class TrackerData {
    constructor(history = []) {
        this.history = history;
    }

    get history() {
        return this._history;
    }

    set history(newFullHistory) {
        const historyWithProbableErrors = detectProbableError(newFullHistory);
        this._history = historyWithProbableErrors.map(record => new ClientHistoryRecord(record));
    }

    get wins() {
        return this.history.filter(item => item.localPlayerWon === true).length
    }

    get losses() {
        return this.history.filter(item => item.localPlayerWon === false).length
    }
}