import React, { useState, useEffect } from 'react'

import './WinTracker.css'

import { useInterval } from './custom-hooks.util'

const defaultState = { wins: 0, losses: 0, winStreak: 0, lossStreak: 0, rawData: {} }

const getConsecutive = (arr, predicate) => {
    const streak = arr.reduce((acc, item) => {
        if(!acc.streakBroken) {
            if(item === predicate) {
                return { ...acc, count: acc.count + 1 }
            } else {
                return { ...acc, streakBroken: true }
            }
        } else {
            return acc
        }
    }, { count: 0, streakBroken: false })

    return streak.count || 0
}

const organizeTrackerData = (trackerData, newResponse) => {
    if (newResponse.GameID === -1 || trackerData.rawData[newResponse.GameID] !== undefined) {
        return trackerData;
    }

    const newRawData = {
        ...trackerData.rawData,
        [newResponse.GameID]: newResponse.LocalPlayerWon
    }

    const recentToOldestGames = [...Object.values(newRawData)].reverse();

    return {
        wins: newResponse.LocalPlayerWon ? trackerData.wins + 1 : trackerData.wins,
        losses:  newResponse.LocalPlayerWon ? trackerData.losses : trackerData.losses + 1,
        winStreak: getConsecutive(recentToOldestGames, true),
        lossStreak: getConsecutive(recentToOldestGames, false),
        rawData: newRawData
    }
}

const WinTracker = () => {
    let [trackerData, setTrackerData] = useState(defaultState);

    useInterval(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/gameResult')
                const responseBody = await response.json();

                if(response.status === 502) {
                    throw new Error(responseBody.message)
                }
    
                setTrackerData(organizeTrackerData(trackerData, responseBody))
            } catch(error) {
                console.log('error: ', error.message)
            }
        }

        fetchData();
      }, 1000);

    return (
        <div className="winTrackerContainer">
            <div>
                <div>
                    Wins: {trackerData.wins}
                </div>
                <div>
                    Losses: {trackerData.losses}
                </div>
                <div>
                    Winstreak: {trackerData.winStreak}
                </div>
                <div>
                    Loss Streak: {trackerData.lossStreak}
                </div>
            </div>
        </div>
    )
}

export default WinTracker