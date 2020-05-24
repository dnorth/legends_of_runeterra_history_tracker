import React from 'react'
import { useTransition } from 'react-spring';

import HistoryRecordView from './HistoryRecordView';

import './AnimatedHistoryTracker.css'

const AnimatedHistoryTracker = ({ trackerData }) => {

    const transitions = useTransition(trackerData.history, record => record.id, {
        from: { opacity: 0, transform: 'translate3d(-100%, 0%,0)' },
        enter: { opacity: 1, transform: 'translate3d(0, 0%,0)' },
        leave: { opacity: 0, transform: 'translate3d(-100%, 0%,0)' },
        trail: 50,
    })

    return (
        <div className="historyTracker">
            {transitions.map(({ item, key, props }) => <HistoryRecordView key={key} id={item.id} record={item} style={props} />)}
        </div>
    )
}

export default AnimatedHistoryTracker;