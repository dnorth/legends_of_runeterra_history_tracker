import React, { useState, useEffect } from 'react'

import TrackerDataFetcher from './TrackerDataFetcher'

import './WinTracker.css'

const WinTracker = (props) => {
    return (
        <TrackerDataFetcher authentication={props.authentication}>
            {({ trackerData, isLoaded }) => isLoaded
                ? (
                    <div className="winTrackerContainer">
                        <div>
                            <div>{trackerData.wins} &minus; {trackerData.losses}</div>
                        </div>
                    </div>
                ) 
                : <div></div>
            }
        </TrackerDataFetcher>
    )
}

export default WinTracker