const uuidv4 = require('uuid').v4;

const LoRHistoryRecord = require('./LorHistoryRecord');
const TwitchAuth = require('./twitchAuth/TwitchAuth');
const { getLoRClientAPI, addOrUpdateHistoryRecordToDynamoDB } = require('./api-utils');
const gameStateTypes = require('./GameState.types');

class LoRHistoryTracker {
    constructor(broadcasterChannelId) {
        this.history = [];
        this.gameState = gameStateTypes.MENUS;
        this.activeRecordID = null;
        this.sessionId = uuidv4();
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

        const authenticatedTwitchUser = TwitchAuth.authenticatedTwitchUser;

        if(authenticatedTwitchUser.id) {
            const response = await getLoRClientAPI('static-decklist');
            const newId = this.addRecordToHistory(authenticatedTwitchUser.id, { playerName, opponentName, deckCode: response.DeckCode, localPlayerWon: null, gameStartTimestamp: new Date().toISOString(), sessionId: this.sessionId });
            this.activeRecordID = newId;
        } else {
            console.log("It doesn't look like you're connected to twitch...")
        }
    }

    async onGameFinish() {
        this.gameState = gameStateTypes.MENUS;

        const authenticatedTwitchUser = TwitchAuth.authenticatedTwitchUser;

        if(authenticatedTwitchUser.id) {
            const response = await getLoRClientAPI('game-result');

            this.editExistingRecord(authenticatedTwitchUser.id, this.activeRecordID, { localPlayerWon: response.LocalPlayerWon, sessionGameId: response.GameID, gameEndTimestamp: new Date().toISOString() });

            this.activeRecordID = null;
        } else {
            console.log("It doesn't look like you're connected to twitch...")
        }
    }

    addRecordToHistory(twitchChannelId, newRecordProperties) {
        const newId = uuidv4();
        const newRecord = new LoRHistoryRecord({ twitchChannelId, id: newId, ...newRecordProperties});
        this.history = [newRecord, ...this.history];

        addOrUpdateHistoryRecordToDynamoDB(newRecord);

        return newId;
    }

    editExistingRecord (twitchChannelId, recordId, newProperties) {
        const recordIndex = this.history.findIndex(record => record.id === recordId);
        const recordToUpdate = this.history[recordIndex];

        if(recordToUpdate) {
            const updatedRecord = recordToUpdate.updateRecord({...newProperties});
            this.history[recordIndex] = updatedRecord;
            addOrUpdateHistoryRecordToDynamoDB(updatedRecord);
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
    }

    get wins() {
        return this.history.filter(item => item.localPlayerWon === true).length
    }

    get losses() {
        return this.history.filter(item => item.localPlayerWon === false).length
    }
}

module.exports = LoRHistoryTracker;