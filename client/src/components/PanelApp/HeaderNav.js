import React from 'react';
import classNames from 'classnames'
import { useHistory } from 'react-router-dom';

import Chevron from './Chevron'

import './HeaderNav.css'

const HeaderNav = (props) => {
    const history = useHistory();
    
    return (
        <div className="topNavBar">
            <div>{ history.canGo(-1) && <Chevron size={4} variant="left" color="white" onClick={history.goBack}/> }</div>
            <div>Last 30 games</div>
            <div>{ history.canGo(1) && <Chevron size={4} color="white" onClick={history.goForward}/> }</div>
        </div>
    )
}

export default HeaderNav