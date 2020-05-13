import { DeckEncoder } from 'runeterra'
import moment from 'moment'
import globalsData from '../data/globals-en_us.json';
import GameStateTypes from './game-state.types'

export default class ClientHistoryRecord {
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
        this.twitchChannelId = twitchChannelId;
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

    set opponentName(opponentName) {
        this._opponentName = opponentName
    }

    get opponentName() {
        const isComputer = this._opponentName.startsWith('decks_') || this._opponentName.startsWith('deckname_');
        return isComputer ? 'A.I.' : this._opponentName
    }

    get gameLength() {
        if (this.gameState === GameStateTypes.INPROGRESS) {
            return moment.utc(moment.duration(moment().diff(this.gameStartTimestamp)).asMilliseconds()).format('mm:ss');
        }

        return moment(this.gameEndTimestamp).from(this.gameStartTimestamp, true);
    }

    get gameState() {
        if (this.localPlayerWon === null) {
            return GameStateTypes.INPROGRESS
        }

        return this.localPlayerWon ? GameStateTypes.VICTORY : GameStateTypes.DEFEAT;
    }

    get timeSinceGame() {
        return moment(this.gameStartTimestamp).fromNow();
    }

    get localGameStartTimeFormatted() {
        return moment(this.gameStartTimestamp).local().format("LLL")
    }

    getDecodedDeck = () => DeckEncoder.decode(this.deckCode)

    getDeckFactions = () => {
        const decodedDeck = this.getDecodedDeck();

        return decodedDeck.reduce((acc, card) => acc.includes(card.faction.shortCode) ? acc : [...acc, card.faction.shortCode], [])
    }

    getDeckFactionImageUrls = () => {
        const factionAbbreviations = this.getDeckFactions()

        return factionAbbreviations.map(faction => globalsData['regions'].find(region => region.abbreviation === faction).iconAbsolutePath);
    }
}