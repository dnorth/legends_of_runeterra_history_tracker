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
    }

    startTrackingHistory(pollInterval) {
        setInterval(async () => {
            const response = await getLoRClientAPI('positional-rectangles');

            if(!this.activeRecordID && this.gameState === gameStateTypes.MENUS && response.GameState === gameStateTypes.INPROGRESS) {
                console.log('game started!')
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
            const staticDecklistResponse = await getLoRClientAPI('static-decklist');


            if(isEmptyObject(staticDecklistResponse.CardsInDeck) || staticDecklistResponse.errorMessage) //https://github.com/RiotGames/developer-relations/issues/282
            {
                //I think we're in an Expeditions match but let's make sure...
                const expeditionsResponse = await getLoRClientAPI('expeditions-state');

                if (expeditionsResponse.IsActive) {
                    //Very positive it's an expeditions match
                    this.onExpeditionMatchStart(playerName, opponentName, authenticatedTwitchUser, expeditionsResponse);
                } else {
                    //Kind of a strange state... but let's just assume it's a normal match.
                    const newId = this.onNormalMatchStart(playerName, opponentName, authenticatedTwitchUser, staticDecklistResponse);
                    console.log(`Cards in Deck returned empty but there was no active expedition for game ${newId}.`)
                }
            } else {
                console.log('normal match')
                this.onNormalMatchStart(playerName, opponentName, authenticatedTwitchUser, staticDecklistResponse);
            }
        } else {
            console.log("It doesn't look like you're connected to twitch...")
        }
    }

    onExpeditionMatchStart(playerName, opponentName, authenticatedTwitchUser, expeditionsResponse) {
        const newId = this.addRecordToHistory(authenticatedTwitchUser.id, { gameType: 'Expeditions', playerName, opponentName, deckCode: null, cardsInDeck: expeditionsResponse.Deck, expeditionsData: expeditionsResponse, localPlayerWon: null, gameStartTimestamp: new Date().toISOString(), sessionId: this.sessionId });
        this.activeRecordID = newId;
        return newId;
    }

    onNormalMatchStart(playerName, opponentName, authenticatedTwitchUser, staticDecklistResponse) {
        const newId = this.addRecordToHistory(authenticatedTwitchUser.id, { gameType: 'Normal', playerName, opponentName, deckCode: staticDecklistResponse.DeckCode, localPlayerWon: null, gameStartTimestamp: new Date().toISOString(), sessionId: this.sessionId });
        this.activeRecordID = newId;
        return newId;
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

    async editExistingRecord (twitchChannelId, recordId, newProperties) {
        const recordIndex = this.history.findIndex(record => record.id === recordId);
        const recordToUpdate = this.history[recordIndex];
        let maybeExpeditionsData = {};


        if(recordToUpdate.gameType === 'Expeditions') {
            const expeditionsResponse = await getLoRClientAPI('expeditions-state');
            maybeExpeditionsData = { expeditionsData: expeditionsResponse }
        }

        if(recordToUpdate) {
            const updatedRecord = recordToUpdate.updateRecord({...newProperties, ...maybeExpeditionsData});
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