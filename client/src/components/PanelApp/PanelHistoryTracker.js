import React, { useState, useEffect } from 'react'

import TrackerDataFetcher from '../TrackerDataFetcher'
import requestingClientTypes from '../requesting-client.types'

import './PanelHistoryTracker.css'

const PanelHistoryTracker = (props) => {
    return (
        <TrackerDataFetcher authentication={props.authentication} requestingClient={requestingClientTypes.HISTORY_TRACKER_PANEL}>
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

export default PanelHistoryTracker