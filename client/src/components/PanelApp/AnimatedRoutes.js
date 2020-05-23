import React, { useState } from 'react'
import { useLocation, Route, Switch } from 'react-router-dom'
import { useTransition, animated } from 'react-spring';

import PanelHistoryTracker from './PanelHistoryTracker';
import SingleRecordView from './SingleRecordView';
import HeaderNav from './HeaderNav';

const HEADER_HEIGHT = 40;

const transitionToSinglePage = {
    initial: { position: 'relative', opacity: 1, transform: 'translate3d(0%, 0%,0)' },
    from: { position: 'absolute', width: '100%', opacity: 0, transform: 'translate3d(100%, 0%,0)' },
    enter: { position: 'relative',  opacity: 1, transform: 'translate3d(0%, 0%,0)' },
    leave: { position: 'absolute', width: '100%', opacity: 0, transform: 'translate3d(-100%, 0%,0)' },
}

const transitionFromSinglePage = {
    initial: { position: 'relative', opacity: 1, transform: 'translate3d(0%, 0%,0)' },
    from: { position: 'absolute', width: '100%', opacity: 0, transform: 'translate3d(-100%, 0%,0)' },
    enter: { position: 'relative', opacity: 1, transform: 'translate3d(0%, 0%,0)' },
    leave: { position: 'absolute', width: '100%', opacity: 0, transform: 'translate3d(100%, 0%,0)' },
}

const AnimatedRoutes = (routeProps) => {
    const location = useLocation();

    const transitionRules = (location.state && location.state.record) ? transitionToSinglePage : transitionFromSinglePage

    const transitions = useTransition(location, location => location.pathname, transitionRules)

    return (
        <>
            <HeaderNav />
            {
                transitions.map(({ item, props, key}) => (
                    <animated.div key={key} style={props}>
                        <Switch location={item}>
                                <Route path={`/:id`}>
                                    <SingleRecordView />
                                </Route>
                            <Route path="/">
                                <PanelHistoryTracker trackerData={routeProps.trackerData} />
                            </Route>
                        </Switch>
                    </animated.div>
                    )
                )
            }
        </>
    ) 
}

export default AnimatedRoutes;