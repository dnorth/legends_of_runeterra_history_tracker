import React from 'react'
import { useLocation, Route, Switch } from 'react-router-dom'
import { useTransition, animated } from 'react-spring';

import PanelHistoryTracker from './PanelHistoryTracker';
import SingleRecordView from './SingleRecordView';
import HeaderNav from './HeaderNav';

const AnimatedRoutes = (routeProps) => {
    const location = useLocation()
    const transitions = useTransition(location, location => location.pathname, {
        initial: { position: 'relative', opacity: 1, transform: 'translate3d(0%, 0%,0)' },
        from: { position: 'absolute', opacity: 0, transform: 'translate3d(100%, 0%,0)' },
        enter: { position: 'relative', opacity: 1, transform: 'translate3d(0, 0%,0)' },
        leave: { position: 'absolute', opacity: 0, transform: 'translate3d(-100%, 0%,0)' },
    })

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
                                <PanelHistoryTracker authentication={routeProps.authentication} />
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