import React, { useState, useEffect } from 'react'

import TrackerDataFetcher from '../TrackerDataFetcher'
import requestingClientTypes from '../requesting-client.types'

import './PanelHistoryTracker.css'

const PanelHistoryTracker = (props) => {
    return (
        <div className="historyTrackerContainer">
            <TrackerDataFetcher authentication={props.authentication} requestingClient={requestingClientTypes.HISTORY_TRACKER_PANEL}>
                {({ trackerData, isLoaded }) => isLoaded
                    ? trackerData.history.map(record => 
                            (<div>{record.id}</div>))
                    : <div></div>
                }
            </TrackerDataFetcher>
        </div>
    )
}

export default PanelHistoryTracker