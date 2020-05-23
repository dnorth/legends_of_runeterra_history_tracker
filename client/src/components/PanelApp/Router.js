import React from 'react'
import { MemoryRouter } from 'react-router-dom';

import classNames from 'classnames';

import ToastProvider from './ToastManager';
import AnimatedRoutes from './AnimatedRoutes';

import './Router.css'

const PanelRouter = (props) => (
    <ToastProvider>
        <div className={classNames("historyTrackerContainer", props.className)}>
            <MemoryRouter>
                <AnimatedRoutes trackerData={props.trackerData} />
            </MemoryRouter>
        </div>
    </ToastProvider>
)

export default PanelRouter