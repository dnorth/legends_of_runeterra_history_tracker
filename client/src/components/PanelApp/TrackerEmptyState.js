import React from 'react'

import HeimerEmote from '../../images/heimer_emote.png'

import './TrackerEmptyState.css';

const TrackerEmptyState = () => (
    <div className="emptyStateContainer">
        <img src={HeimerEmote} className="emptyStateIcon" />
        <div>There are no games to show.</div>
    </div>
)

export default TrackerEmptyState;