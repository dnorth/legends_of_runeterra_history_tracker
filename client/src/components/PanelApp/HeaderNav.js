import React from 'react';
import classNames from 'classnames'
import { useHistory, useLocation } from 'react-router-dom';

import TopNavBackground from '../../images/BG_Menu.png'

import Chevron from './Chevron'

import './HeaderNav.css'

const HeaderNav = (props) => {
    const history = useHistory();
    const location = useLocation();
    const noop = () => {};

    const canGoBackward = history.canGo(-1);
    const canGoForward = history.canGo(1);

    return (
        <div className="topNavBar">
            <div className={classNames("chevronContainer", { 'available': canGoBackward })} onClick={canGoBackward ? history.goBack : noop}>
                { canGoBackward && <Chevron size={16} variant="left" color="white"/> }
            </div>
            <div className="navStateText">
                {
                    (location.state && location.state.record) ? 'Deck Details' : 'Last 30 games'
                }
            </div>
            <div className={classNames("chevronContainer", { 'available': canGoForward })} onClick={canGoForward ? history.goForward : noop}>
                { canGoForward && <Chevron size={16} color="white" /> }
            </div>
        </div>
    )
}

export default HeaderNav