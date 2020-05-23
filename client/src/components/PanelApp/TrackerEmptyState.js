import React from 'react'

import TrackerIconSvg from '../../images/tracker_icon.svg'

import './TrackerEmptyState.css';

const TrackerEmptyState = () => (
    <div className="emptyStateContainer">
        <TrackerIconSvg className="emptyStateIcon" />
        <div>There are no games to show.</div>
    </div>
)

export default TrackerEmptyState;