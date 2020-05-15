import React from 'react'
import classNames from 'classnames';

import TrackerDataFetcher from '../TrackerDataFetcher'
import requestingClientTypes from '../requesting-client.types'
import AnimatedHistoryTracker from './AnimatedHistoryTracker'

const PanelHistoryTracker = (props) => {
    return (
        <TrackerDataFetcher authentication={props.authentication} requestingClient={requestingClientTypes.HISTORY_TRACKER_PANEL}>
            {({ trackerData, isLoaded }) => isLoaded
                ? <AnimatedHistoryTracker trackerData={trackerData} />
                : <div></div>
            }
        </TrackerDataFetcher>
    )
}

export default PanelHistoryTracker