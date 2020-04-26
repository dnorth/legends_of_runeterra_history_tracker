import React, { useState, useEffect } from 'react'

import { useInterval } from '../util/custom-hooks.util'
import GameStateTypes from './game-state.types'
import TrackerData from './TrackerData'

const trackerData = new TrackerData();

const makeRequest = async (url) => {
    const response = await fetch(url)
    const responseBody = await response.json();

    if (response.status === 502) {
        throw new Error(responseBody.message)
    }

    return responseBody;
}

const addWinStateToActiveRecord = async (forceTrackerDataRerender, activeRecordId) => {
    try {
        const response = await makeRequest('http://localhost:5000/api/gameResult')
        
        TrackerData.editExistingRecord(activeRecordId, { localPlayerWon: response.LocalPlayerWon, gameId: response.GameID })

        forceTrackerDataRerender({})
    } catch(error) {
        console.log('error: ', error.message)
    }}

const addTrackerDataRecord = async (forceTrackerDataRerender, opponentName, setActiveRecordId) => {
    try {
        const response = await makeRequest('http://localhost:5000/api/staticDecklist')

        const newId = TrackerData.addRecordToHistory({ opponentName, deckCode: response.DeckCode, localPlayerWon: null })

        setActiveRecordId(newId);
        forceTrackerDataRerender({});
    } catch(error) {
        console.log('error: ', error.message)
    }
}

const pollGameState = () => {
    let [_, forceTrackerDataRerender] = useState({});
    let [gameState, setGameState] = useState(GameStateTypes.MENUS);
    let [activeRecordId, setActiveRecordId] = useState(null)

    useInterval(() => {
        const fetchData = async () => {
            try {
                const response = await makeRequest('http://localhost:5000/api/positionalRectangles')

                if(gameState === GameStateTypes.MENUS && response.GameState === GameStateTypes.INPROGRESS) {
                    addTrackerDataRecord(forceTrackerDataRerender, response.OpponentName, setActiveRecordId)
                    setGameState(GameStateTypes.INPROGRESS)
                }

                if(gameState === GameStateTypes.INPROGRESS && response.GameState === GameStateTypes.MENUS) {
                    //call the gameResult endpoint and set who won in the rawData record
                    if(activeRecordId) {
                        addWinStateToActiveRecord(forceTrackerDataRerender, activeRecordId);
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
}

const TrackerDataFetcher = (props) => {
    pollGameState()

    return (
        <>
            {props.children(trackerData)}
        </>
    )
}

export default TrackerDataFetcher