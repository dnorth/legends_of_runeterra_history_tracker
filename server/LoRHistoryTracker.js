const uuidv4 = require('uuid').v4;
const { getLoRClientAPI } = require('./api-utils');
const gameStateTypes = require('./GameState.types');

class LoRHistoryTracker {
    constructor(io) {
        this.io = io;
        this.history = [];
        this.gameState = gameStateTypes.MENUS;
        this.activeRecordID = null;
    }

    startTrackingHistory(pollInterval) {
        setInterval(async () => {
            const response = await getLoRClientAPI('positional-rectangles');
            
            if(!this.activeRecordID && this.gameState === gameStateTypes.MENUS && response.GameState === gameStateTypes.INPROGRESS) {
                await this.onGameStart(response.OpponentName);
            }

            if(this.activeRecordID && this.gameState === gameStateTypes.INPROGRESS && response.GameState === gameStateTypes.MENUS) {
                await this.onGameFinish();
            }
        }, pollInterval);
    }

    async onGameStart(opponentName) {
        this.gameState = gameStateTypes.INPROGRESS;

        const response = await getLoRClientAPI('static-decklist');

        const newId = this.addRecordToHistory({ opponentName, deckCode: response.DeckCode, localPlayerWon: null })

        this.activeRecordID = newId;
    }

    async onGameFinish() {
        this.gameState = gameStateTypes.MENUS;

        const response = await getLoRClientAPI('game-result');

        this.editExistingRecord(this.activeRecordID, { localPlayerWon: response.LocalPlayerWon, gameId: response.GameID });

        this.activeRecordID = null;
    }

    addRecordToHistory(newRecord) {
        const newId = uuidv4();
        const fullRecord = {id: newId, ...newRecord}
        this.history = [fullRecord, ...this.history]

        return newId;
    }

    editExistingRecord (recordId, newProperties) {
        let recordIndex = this.history.findIndex(record => record.id === recordId)
        if(recordIndex !== undefined) {
            this.history[recordIndex] = {...this.history[recordIndex], ...newProperties};
            this.io.sockets.emit('onHistoryUpdated', this.history);
        }
    }

    get history() {
        return this._history;
    }

    set history(newFullHistory) {
        this._history = newFullHistory;
        this.io.sockets.emit('onHistoryUpdated', this.history);
    }

    get wins() {
        return this.history.filter(item => item.localPlayerWon === true).length
    }

    get losses() {
        return this.history.filter(item => item.localPlayerWon === false).length
    }
}

module.exports = LoRHistoryTracker;