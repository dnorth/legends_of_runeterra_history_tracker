import React from 'react';

import ProgressRing from '../../images/progress_ring.png'

import './DetailCounter.css';

const DetailCounter = (props) => {
    const styleProps = { height: `${props.size}px`, width: `${props.size}px`, bottom: `${props.bottomOffset}px`, right: `${props.rightOffset}px` }

    return (
        <div className="detailCounterContainer">
            {props.children}
            <div className="countRingText" style={styleProps}>{props.count}</div>
        </div>
    )
}

DetailCounter.defaultProps = {
    size: 24,
    bottomOffset: 0,
    rightOffset: 0
}

export default DetailCounter;