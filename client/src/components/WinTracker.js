import React, { useState, useEffect } from 'react'

import TrackerDataFetcher from './TrackerDataFetcher'

import './WinTracker.css'

const WinTracker = () => {
    return (
        <TrackerDataFetcher>
            {(trackerData) => (
                <div className="winTrackerContainer">
                    <div>
                        <div>{trackerData.wins} &minus; {trackerData.losses}</div>
                    </div>
                </div>
            )}
        </TrackerDataFetcher>
    )
}

export default WinTracker