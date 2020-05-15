import React from 'react'
import classNames from 'classnames';

import TrackerDataFetcher from '../TrackerDataFetcher'
import HistoryRecordView from './HistoryRecordView';
import requestingClientTypes from '../requesting-client.types'

import ToastProvider from './ToastManager';

import './PanelHistoryTracker.css'

const PanelHistoryTracker = (props) => {
    return (
        <ToastProvider>
            <div className={classNames("historyTrackerContainer", props.className)}>
                <TrackerDataFetcher authentication={props.authentication} requestingClient={requestingClientTypes.HISTORY_TRACKER_PANEL}>
                    {({ trackerData, isLoaded }) => isLoaded
                        ? trackerData.history.map(record => <HistoryRecordView key={record.id} record={record} />)
                        : <div></div>
                    }
                </TrackerDataFetcher>
            </div>
        </ToastProvider>
    )
}

export default PanelHistoryTracker