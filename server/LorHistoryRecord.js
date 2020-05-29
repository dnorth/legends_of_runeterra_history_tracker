class LoRHistoryRecord {
    constructor({ id, playerName, opponentName, deckCode, localPlayerWon, sessionGameId, gameStartTimestamp, gameEndTimestamp, sessionId, twitchChannelId, cardsInDeck, expeditionsData, gameType }) {
        this.id = id;
        this.playerName = playerName;
        this.opponentName = opponentName;
        this.deckCode = deckCode;
        this.localPlayerWon = localPlayerWon;
        this.sessionGameId = sessionGameId;
        this.gameStartTimestamp = gameStartTimestamp;
        this.gameEndTimestamp = gameEndTimestamp;
        this.sessionId = sessionId;
        this.twitchChannelId = twitchChannelId;
        this.cardsInDeck = cardsInDeck;
        this.expeditionsData = expeditionsData;
        this.gameType = gameType;
    }

    updateRecord = ({ id, playerName, opponentName, deckCode, localPlayerWon, sessionGameId, gameStartTimestamp, gameEndTimestamp, sessionId, twitchChannelId, cardsInDeck, expeditionsData, gameType }) => {
        this.id = id || this.id;
        this.playerName = playerName || this.playerName;
        this.opponentName = opponentName || this.opponentName;
        this.deckCode = deckCode || this.deckCode;
        this.localPlayerWon = localPlayerWon == null ? this.localPlayerWon : localPlayerWon;
        this.sessionGameId = sessionGameId === null ? this.sessionGameId : sessionGameId;
        this.gameStartTimestamp = gameStartTimestamp || this.gameStartTimestamp;
        this.gameEndTimestamp = gameEndTimestamp || this.gameEndTimestamp;
        this.sessionId = sessionId || this.sessionId;
        this.twitchChannelId = twitchChannelId || this.twitchChannelId;
        this.cardsInDeck = cardsInDeck || this.cardsInDeck;
        this.expeditionsData = expeditionsData || this.expeditionsData;
        this.gameType = gameType || this.gameType;

        return this;
    }

    get dynamoDbBasicParams() {
        return {
            TableName: 'LoRHistory',
            Item: this.toJson()
        }
    }

    get dynamoDbPlayerNameParams() {
        return {
            ...this.dynamoDbBasicParams,
            IndexName: 'playerName-index'
        }
    }

    toJson = () => {
        //Deck data for challenges doesn't come back properly. So let's just not save that. 
        const isAChallenge = this.opponentName.startsWith('game_');

        return {
            id: this.id,
            playerName: this.playerName,
            opponentName: this.opponentName,
            deckCode: isAChallenge ? null : this.deckCode,
            localPlayerWon: this.localPlayerWon,
            sessionGameId: this.sessionGameId,
            gameStartTimestamp: this.gameStartTimestamp,
            gameEndTimestamp: this.gameEndTimestamp,
            sessionId: this.sessionId,
            twitchChannelId: this.twitchChannelId || 'playerName',
            cardsInDeck: isAChallenge ? null : this.cardsInDeck,
            expeditionsData: this.expeditionsData,
            gameType: this.gameType
        }
    }
}

module.exports = LoRHistoryRecord;