import React from 'react'
import {
    MemoryRouter,
    Switch,
    Route
} from 'react-router-dom';

import classNames from 'classnames';

import PanelHistoryTracker from './PanelHistoryTracker';
import SingleRecordView from './SingleRecordView';
import ToastProvider from './ToastManager';

import './Router.css'

const PanelRouter = (props) => {
    return (
        <ToastProvider>
            <div className={classNames("historyTrackerContainer", props.className)}>
                <MemoryRouter>
                    <Switch>
                        <Route path={`/:id`}>
                            <SingleRecordView />
                        </Route>
                        <Route path="/">
                            <PanelHistoryTracker authentication={props.authentication} />
                        </Route>
                    </Switch>
                </MemoryRouter>
            </div>
        </ToastProvider>
    )
}

export default PanelRouter