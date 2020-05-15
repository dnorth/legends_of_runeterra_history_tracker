import React, { useState } from 'react'
import { animated, useTransition } from 'react-spring';

import HistoryRecordView from './HistoryRecordView';
import HeaderNav from './HeaderNav'

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
            <HeaderNav showNav={displayTopNavBar} />
            {transitions.map(({ item, key, props }) => <HistoryRecordView key={key} id={item.id} record={item} style={props} />)}
        </>
    )    
}

export default AnimatedHistoryTracker;