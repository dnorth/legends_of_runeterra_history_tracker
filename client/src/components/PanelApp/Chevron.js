import React from 'react'

import ChevronRight from '../../images/ArrowRightIcon.png';
import ChevronLeft from '../../images/ArrowLeftIcon.png';

import './Chevron.css'

const Chevron = (props) => (
    <img src={props.variant === 'right' ? ChevronRight : ChevronLeft} style={{ height: `${props.size}px`, width: `${props.size}px` }} {...props}/>
)

Chevron.defaultProps = {
    variant: 'right',
    size: 24,
}

export default Chevron