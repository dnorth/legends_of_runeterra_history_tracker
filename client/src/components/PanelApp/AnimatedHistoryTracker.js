import React, { useState } from 'react'
import { animated, useTransition } from 'react-spring';

import classNames from 'classnames'

import HistoryRecordView from './HistoryRecordView';

import './AnimatedHistoryTracker.css'

const AnimatedHistoryTracker = ({ trackerData }) => {
    const [displayTopNavBar, setDisplayTopNavBar] = useState(false)

    const transitions = useTransition(trackerData.history, record => record.id, {
        from: { opacity: 0, transform: 'translate3d(0, -100%,0)' },
        enter: { opacity: 1, transform: 'translate3d(0, 0%,0)' },
        leave: { opacity: 0, transform: 'translate3d(0, -100%,0)' },
        trail: 50,
        onRest: () => setDisplayTopNavBar(true)
    })

    return (
        <>
            <div className={classNames("topNavBar", { "show": displayTopNavBar })}>Last 30 games</div>
            {transitions.map(({ item, key, props }) => <HistoryRecordView key={key} id={item.id} record={item} style={props} />)}
        </>
    )    
}

export default AnimatedHistoryTracker;