import React, { useState, useEffect } from 'react'

import TrackerDataFetcher from '../TrackerDataFetcher'
import requestingClientTypes from '../requesting-client.types'

import './WinTracker.css'

const WinTracker = (props) => {
    return (
        <TrackerDataFetcher authentication={props.authentication} requestingClient={requestingClientTypes.WIN_TRACKER_OVERLAY}>
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