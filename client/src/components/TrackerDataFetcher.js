import React, { useState, useEffect } from 'react'

import { useInterval } from '../util/custom-hooks.util'
import GameStateTypes from './game-state.types'
import TrackerData from './TrackerData'

const defaultState = { wins: 0, losses: 0, winStreak: 0, lossStreak: 0, rawData: {} }

const makeRequest = async (url) => {
    const response = await fetch(url)
    const responseBody = await response.json();

    if (response.status === 502) {
        throw new Error(responseBody.message)
    }

    return responseBody;
}

const addWinStateToActiveRecord = async (trackerData, setTrackerData, activeRecordId) => {
    try {
        const response = await makeRequest('http://localhost:5000/api/gameResult')

        trackerData.editExistingRecord(activeRecordId, { localPlayerWon: response.LocalPlayerWon, gameId: response.GameID })

        setTrackerData(trackerData)
    } catch(error) {
        console.log('error: ', error.message)
    }}

const addTrackerDataRecord = async (trackerData, setTrackerData, opponentName, setActiveRecordId) => {
    try {
        const response = await makeRequest('http://localhost:5000/api/staticDecklist')

        const newRecordId = trackerData.addRecordToHistory({ opponentName, deckCode: response.DeckCode, localPlayerWon: null })

        setActiveRecordId(newRecordId);
        setTrackerData(trackerData);
    } catch(error) {
        console.log('error: ', error.message)
    }
}

const pollGameState = () => {
    let [trackerData, setTrackerData] = useState(new TrackerData());
    let [gameState, setGameState] = useState(GameStateTypes.MENUS);
    let [activeRecordId, setActiveRecordId] = useState(null)

    useInterval(() => {
        const fetchData = async () => {
            try {
                const response = await makeRequest('http://localhost:5000/api/positionalRectangles')

                if(gameState === GameStateTypes.MENUS && response.GameState === GameStateTypes.INPROGRESS) {
                    addTrackerDataRecord(trackerData, setTrackerData, response.OpponentName, setActiveRecordId)
                    setGameState(GameStateTypes.INPROGRESS)
                }

                if(gameState === GameStateTypes.INPROGRESS && response.GameState === GameStateTypes.MENUS) {
                    //call the gameResult endpoint and set who won in the rawData record
                    if(activeRecordId) {
                        addWinStateToActiveRecord(trackerData, setTrackerData, activeRecordId);
                        setActiveRecordId(null);
                    }
                    setGameState(GameStateTypes.MENUS)
                }
            } catch(error) {
                console.log('error: ', error.message)
            }
        }

        fetchData();
      }, 1000);

      return trackerData;
}

const TrackerDataFetcher = (props) => {
    const trackerData = pollGameState()

    return (
        <>
            {props.children(trackerData)}
        </>
    )
}

export default TrackerDataFetcher