import React from 'react'

import classNames from 'classnames'

import './Chevron.css'

const Chevron = (props) => (
    <span className={classNames("chevron", props.variant)} style={{ height: `${props.size}px`, width: `${props.size}px`, color: props.color }} {...props}/>
)

Chevron.defaultProps = {
    variant: 'right',
    size: 8,
    color: '#4b4b4b'
}

export default Chevron