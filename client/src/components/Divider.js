import React from 'react'

import './Divider.css'

const Divider = (props) => (
    <div className="divider" style={{ width: `${props.width}px`}} />
)

Divider.defaultProps = {
    width: 160
}

export default Divider;