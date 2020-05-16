import React from 'react'

import Background from '../../images/PlayerQueuePanel_Background_TX.png'
import BackgroundOverlay from '../../images/PlayerQueuePanel_Background2_TX.png'

import './StickyBackground.css'

const StickyBackground = (props) => (
    <>
        <div className="stickyBackgroundContainer">
            <img src={Background} className="stickyBackground" />
        </div>
        <div className="stickyBackgroundContainer">
            <img src={BackgroundOverlay} className="stickyBackground" />
        </div>
    </>
)

export default StickyBackground;