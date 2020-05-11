const dynamoDBConfig = require('./dynamodb/config/config');

class LoRHistoryRecord {
    constructor({ id, playerName, opponentName, deckCode, localPlayerWon, sessionGameId, gameStartTimestamp, gameEndTimestamp, sessionId, twitchChannelId }) {
        this.id = id;
        this.playerName = playerName;
        this.opponentName = opponentName;
        this.deckCode = deckCode;
        this.localPlayerWon = localPlayerWon;
        this.sessionGameId = sessionGameId;
        this.gameStartTimestamp = gameStartTimestamp;
        this.gameEndTimestamp = gameEndTimestamp;
        this.sessionId = sessionId;
        this.twitchChannelId = twitchChannelId.toString();
    }

    updateRecord = ({ id, playerName, opponentName, deckCode, localPlayerWon, sessionGameId, gameStartTimestamp, gameEndTimestamp, sessionId, twitchChannelId }) => {
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

        return this;
    }

    get dynamoDbBasicParams() {
        return {
            TableName: dynamoDBConfig.lor_history_table_name,
            Item: this.toJson()
        }
    }

    toJson = () => {
        return {
            id: this.id,
            playerName: this.playerName,
            opponentName: this.opponentName,
            deckCode: this.deckCode,
            localPlayerWon: this.localPlayerWon,
            sessionGameId: this.sessionGameId,
            gameStartTimestamp: this.gameStartTimestamp,
            gameEndTimestamp: this.gameEndTimestamp,
            sessionId: this.sessionId,
            twitchChannelId: this.twitchChannelId
        }
    }
}

module.exports = LoRHistoryRecord;