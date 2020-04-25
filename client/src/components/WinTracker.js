import React, { useState, useEffect } from 'react'

import './WinTracker.css'

import { organizeTrackerData } from '../util/tracker-utils.util'
import { useInterval } from '../util/custom-hooks.util'

const defaultState = { wins: 0, losses: 0, winStreak: 0, lossStreak: 0, rawData: {} }

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
                <div>{trackerData.wins} &minus; {trackerData.losses}</div>
            </div>
        </div>
    )
}

export default WinTracker