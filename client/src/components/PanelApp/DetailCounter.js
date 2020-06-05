import React from 'react';

import './DetailCounter.css';

const DetailCounter = (props) => {
    const styleProps = { height: `${props.size}px`, width: `${props.size}px`, bottom: `${props.bottomOffset}px`, right: `${props.rightOffset}px` }

    return (
        <div className="detailCounterContainer">
            {props.children}
            {
                props.show && <div className={`countRingText variant-${props.variant}`} style={styleProps}>{props.count}</div>
            }
        </div>
    )
}

DetailCounter.defaultProps = {
    size: 24,
    bottomOffset: 0,
    rightOffset: 0,
    show: true,
    variant: 'default'
}

export default DetailCounter;