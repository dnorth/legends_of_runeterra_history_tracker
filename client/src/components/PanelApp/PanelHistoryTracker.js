import React from 'react'
import classNames from 'classnames';

import TrackerEmptyState from './TrackerEmptyState';
import AnimatedHistoryTracker from './AnimatedHistoryTracker'

const PanelHistoryTracker = ({ trackerData }) => {
    return trackerData.history.length
    ? <AnimatedHistoryTracker trackerData={trackerData} />
    : <TrackerEmptyState />
}

export default PanelHistoryTracker