import React from 'react'
import classNames from 'classnames';

import TrackerDataFetcher from '../TrackerDataFetcher'
import requestingClientTypes from '../requesting-client.types'
import AnimatedHistoryTracker from './AnimatedHistoryTracker'
import ToastProvider from './ToastManager';

import './PanelHistoryTracker.css'

const PanelHistoryTracker = (props) => {
    return (
        <ToastProvider>
            <div className={classNames("historyTrackerContainer", props.className)}>
                <TrackerDataFetcher authentication={props.authentication} requestingClient={requestingClientTypes.HISTORY_TRACKER_PANEL}>
                    {({ trackerData, isLoaded }) => isLoaded
                        ? <AnimatedHistoryTracker trackerData={trackerData} />
                        : <div></div>
                    }
                </TrackerDataFetcher>
            </div>
        </ToastProvider>
    )
}

export default PanelHistoryTracker