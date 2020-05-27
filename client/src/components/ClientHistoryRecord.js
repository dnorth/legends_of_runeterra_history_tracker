import { DeckEncoder, Card } from 'runeterra'
import moment from 'moment'
import globalsData from '../data/globals-en_us.json';
import fullCardData from '../data/full-card-data';
import GameStateTypes from './game-state.types'

export default class ClientHistoryRecord {
    constructor({ id, playerName, opponentName, deckCode, localPlayerWon, sessionGameId, gameStartTimestamp, gameEndTimestamp, sessionId, twitchChannelId, probableError, cardsInDeck, expeditionsData, gameType }) {
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
        this.probableError = probableError;
        this.cardsInDeck = cardsInDeck;
        this.expeditionsData = expeditionsData;
        this.gameType = gameType;
    }

    toJson = () => {
        return {
            id: this.id,
            playerName: this.playerName,
            opponentName: this._opponentName,
            deckCode: this.deckCode,
            localPlayerWon: this.localPlayerWon,
            sessionGameId: this.sessionGameId,
            gameStartTimestamp: this.gameStartTimestamp,
            gameEndTimestamp: this.gameEndTimestamp,
            sessionId: this.sessionId,
            twitchChannelId: this.twitchChannelId,
            cardsInDeck: this.cardsInDeck,
            expeditionsData: this.expeditionsData,
            gameType: this.gameType
        }
    }

    set opponentName(opponentName) {
        this._opponentName = opponentName
    }

    get opponentName() {
        const computerNames = ['decks_', 'deckname_', 'front_five_', 'game_'];
        const isComputer = computerNames.some(name => this._opponentName.startsWith(name));
        return isComputer ? 'A.I.' : this._opponentName
    }

    get gameLength() {
        if (this.gameState === GameStateTypes.INPROGRESS) {
            return moment.utc(moment.duration(moment().diff(this.gameStartTimestamp)).asMilliseconds()).format('mm:ss');
        }

        if (this.probableError) {
            return ''
        }

        return moment(this.gameEndTimestamp).from(this.gameStartTimestamp, true);
    }

    get gameState() {
        if (this.probableError) {
            return GameStateTypes.ERROR
        }

        if (this.localPlayerWon === null) {
            return GameStateTypes.INPROGRESS
        }

        return this.localPlayerWon ? GameStateTypes.VICTORY : GameStateTypes.DEFEAT;
    }

    get timeSinceGame() {
        const timeSinceGame = moment(this.gameEndTimestamp).fromNow();
        return timeSinceGame === "a few seconds ago" ? "moments ago" : timeSinceGame;
    }

    get localGameStartTimeFormatted() {
        return moment(this.gameStartTimestamp).local().format("LLL")
    }

    get localGameEndTimeFormatted() {
        return moment(this.gameEndTimestamp).local().format("LLL")
    }

    get gameEndedSuccessfully() {
        return !!(this.gameState === GameStateTypes.VICTORY || this.gameState === GameStateTypes.DEFEAT)
    }

    getDecodedDeck = () => {
        if (this.cardsInDeck) {
            return this.buildThirdPartyCards();
        }

        return this.deckCode ? DeckEncoder.decode(this.deckCode) : [];
    }

    getOrganizedCardsInDeck = () => this.cardsInDeck.reduce((acc, item) => {
        if(item in acc) {
            return { ...acc, [item]: acc[item] + 1 }
        } else {
            return { ...acc, [item]: 1 }
        }
    }, {});

    buildThirdPartyCards = () => {
        const organizedCards = this.getOrganizedCardsInDeck();

        return Object.entries(organizedCards).map(([cardCode, cardCount]) => new Card(cardCode, cardCount));
    }

    getDeckFactions = () => {
        const decodedDeck = this.getDecodedDeck();

        return decodedDeck.reduce((acc, card) => acc.includes(card.faction.shortCode) ? acc : [...acc, card.faction.shortCode], [])
    }

    getDeckFactionImageUrls = () => {
        const factionAbbreviations = this.getDeckFactions()

        return factionAbbreviations.map(faction => globalsData['regions'].find(region => region.abbreviation === faction).iconAbsolutePath);
    }

    getDetailedDeckInfo = () => {
        const decodedDeck = this.getDecodedDeck();
        return decodedDeck.map(deckCard => ({ ...deckCard, ...fullCardData.find(card => card.cardCode === deckCard.code) })).sort((a, b) => a.cost - b.cost)
    }

    getCardTypeCount = () => {
        const detailedDeckInfo = this.getDetailedDeckInfo();

        return detailedDeckInfo.reduce((acc, item) => {
            if(item.type === 'Spell') {
                return {...acc, 'Spells': { ...acc.Spells, count: acc.Spells.count + item.count, items: [...acc.Spells.items, item] }}
            }

            if(item.type === 'Unit') {
                if(item.supertype === 'Champion') {
                    return {...acc, 'Champions': { ...acc.Champions, count: acc.Champions.count + item.count, items: [...acc.Champions.items, item] }}
                } else {
                    return {...acc, 'Followers': { ...acc.Followers, count: acc.Followers.count + item.count, items: [...acc.Followers.items, item] }}
                }
            }
        }, { 'Champions': { count: 0, items: [] }, 'Spells': { count: 0, items: [] }, 'Followers': { count: 0, items: [] } })
    }

    static getCardProfilePicUrl = (code) => {
        return `https://s3.us-east-2.amazonaws.com/runeterra.history.tracker/client/assets/champ_pfps/${code}.png`;
    }
}