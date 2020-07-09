const uuidv4 = require('uuid').v4;

const LoRHistoryRecord = require('./LorHistoryRecord');
const TwitchAuth = require('./twitchAuth/TwitchAuth');
const { getLoRClientAPI, addOrUpdateHistoryRecordToDynamoDB } = require('./api-utils');
const gameStateTypes = require('./GameState.types');
const { isEmptyObject } = require('./utils');

class LoRHistoryTracker {
    constructor(broadcasterChannelId) {
        this.history = [];
        this.gameState = gameStateTypes.MENUS;
        this.activeRecordID = null;
        this.sessionId = uuidv4();
        this.currentDeckCode = null;
    }

    startTrackingHistory(pollInterval) {
        setInterval(async () => {
            const response = await getLoRClientAPI('positional-rectangles');

            const staticDecklistResponse = await getLoRClientAPI('static-decklist');

            if(!this.currentDeckCode && this.activeRecordID && staticDecklistResponse.DeckCode) {
                const authenticatedTwitchUser = TwitchAuth.authenticatedTwitchUser;

                this.editExistingRecord(authenticatedTwitchUser.id, this.activeRecordID, { deckCode: staticDecklistResponse.DeckCode });

                this.currentDeckCode = staticDecklistResponse.DeckCode;
                console.log('\nUpdated deck code after the fact.\n');
            }

            if(!this.activeRecordID && this.gameState === gameStateTypes.MENUS && response.GameState === gameStateTypes.INPROGRESS) {
                this.currentDeckCode = staticDecklistResponse.DeckCode;
                await this.onGameStart(response.PlayerName, response.OpponentName, staticDecklistResponse);
            }

            if(this.activeRecordID && this.gameState === gameStateTypes.INPROGRESS && response.GameState === gameStateTypes.MENUS) {
                this.currentDeckCode = null;
                await this.onGameFinish();
            }                
        }, pollInterval);
    }

    async onGameStart(playerName, opponentName, staticDecklistResponse) {
        this.gameState = gameStateTypes.INPROGRESS;

        const authenticatedTwitchUser = TwitchAuth.authenticatedTwitchUser;

        this.onNormalMatchStart(playerName, opponentName, authenticatedTwitchUser, staticDecklistResponse);
    }

    onNormalMatchStart(playerName, opponentName, authenticatedTwitchUser, staticDecklistResponse) {
        const newId = this.addRecordToHistory(authenticatedTwitchUser.id, { gameType: 'Normal', playerName, opponentName, deckCode: staticDecklistResponse.DeckCode, localPlayerWon: null, gameStartTimestamp: new Date().toISOString(), sessionId: this.sessionId });
        this.activeRecordID = newId;
        return newId;
    } 

    async onGameFinish() {
        this.gameState = gameStateTypes.MENUS;

        const authenticatedTwitchUser = TwitchAuth.authenticatedTwitchUser;

        const response = await getLoRClientAPI('game-result');

        this.editExistingRecord(authenticatedTwitchUser.id, this.activeRecordID, { localPlayerWon: response.LocalPlayerWon, sessionGameId: response.GameID, gameEndTimestamp: new Date().toISOString() });

        this.activeRecordID = null;
    }

    addRecordToHistory(twitchChannelId, newRecordProperties) {
        const newId = uuidv4();
        const newRecord = new LoRHistoryRecord({ twitchChannelId, id: newId, ...newRecordProperties});
        this.history = [newRecord, ...this.history];

        addOrUpdateHistoryRecordToDynamoDB(newRecord);

        return newId;
    }

    async editExistingRecord (twitchChannelId, recordId, newProperties) {
        const recordIndex = this.history.findIndex(record => record.id === recordId);
        const recordToUpdate = this.history[recordIndex];

        if(recordToUpdate) {
            const updatedRecord = recordToUpdate.updateRecord({...newProperties });
            this.history[recordIndex] = updatedRecord;
            addOrUpdateHistoryRecordToDynamoDB(updatedRecord);
        }
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
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