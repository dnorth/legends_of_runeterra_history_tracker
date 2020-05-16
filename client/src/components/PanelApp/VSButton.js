import React from 'react'

import classNames from 'classnames';

import './VSButton.css'

import VsRing from '../../images/PlayerQueuePanel_Ring_TX.png'
import VSBackground from '../../images/BTN_Round_Face.png'

const VSButton = (props) => {
    const sizeStyles = { height: `${props.size}px`, width: `${props.size}px`}
    
    return (
        <div className={classNames("vsButtonContainer", props.className)} style={sizeStyles}>
        <img src={VSBackground} className="vsItem" style={sizeStyles} />
        <img src={VsRing} className="vsItem" style={sizeStyles} />
        <div className="vsItem vsText">VS</div>
    </div>
    )
}

VSButton.defaultProps = {
    size: 50
}

export default VSButton;