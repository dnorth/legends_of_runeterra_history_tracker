const uuidv4 = require('uuid').v4;

const LoRHistoryRecord = require('./LorHistoryRecord');
const { getLoRClientAPI, addOrUpdateHistoryRecordToDynamoDB } = require('./api-utils');
const gameStateTypes = require('./GameState.types');

class LoRHistoryTracker {
    constructor(io, broadcasterChannelId) {
        this.io = io;
        this.history = [];
        this.gameState = gameStateTypes.MENUS;
        this.activeRecordID = null;
        this.sessionId = uuidv4();
        this.twitchChannelId = broadcasterChannelId;
    }

    startTrackingHistory(pollInterval) {
        setInterval(async () => {
            const response = await getLoRClientAPI('positional-rectangles');
            
            if(!this.activeRecordID && this.gameState === gameStateTypes.MENUS && response.GameState === gameStateTypes.INPROGRESS) {
                await this.onGameStart(response.PlayerName, response.OpponentName);
            }

            if(this.activeRecordID && this.gameState === gameStateTypes.INPROGRESS && response.GameState === gameStateTypes.MENUS) {
                await this.onGameFinish();
            }            
        }, pollInterval);
    }

    async onGameStart(playerName, opponentName) {
        this.gameState = gameStateTypes.INPROGRESS;

        const response = await getLoRClientAPI('static-decklist');

        const newId = this.addRecordToHistory({ playerName, opponentName, deckCode: response.DeckCode, localPlayerWon: null, gameStartTimestamp: new Date().toISOString(), sessionId: this.sessionId });

        this.activeRecordID = newId;
    }

    async onGameFinish() {
        this.gameState = gameStateTypes.MENUS;

        const response = await getLoRClientAPI('game-result');

        this.editExistingRecord(this.activeRecordID, { localPlayerWon: response.LocalPlayerWon, sessionGameId: response.GameID, gameEndTimestamp: new Date().toISOString() });

        this.activeRecordID = null;
    }

    addRecordToHistory(newRecordProperties) {
        const newId = uuidv4();
        const newRecord = new LoRHistoryRecord({ twitchChannelId: this.twitchChannelId, id: newId, ...newRecordProperties});
        this.history = [newRecord, ...this.history];

        addOrUpdateHistoryRecordToDynamoDB(newRecord);

        return newId;
    }

    editExistingRecord (recordId, newProperties) {
        const recordIndex = this.history.findIndex(record => record.id === recordId);
        const recordToUpdate = this.history[recordIndex];

        if(recordToUpdate) {
            const updatedRecord = recordToUpdate.updateRecord({...newProperties});
            this.history[recordIndex] = updatedRecord;
            addOrUpdateHistoryRecordToDynamoDB(updatedRecord);
            this.io.sockets.emit('onHistoryUpdated', this.history);
        }
    }

    resetSession = () => {
        this.history = [];
        this.gameState = gameStateTypes.MENUS;
        this.activeRecordID = null;
        this.sessionId = uuidv4();
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