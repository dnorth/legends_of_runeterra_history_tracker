import React from 'react';
import classNames from 'classnames';
import { animated } from 'react-spring';

import QuinnEmote from '../../images/quinn_skeptical_icon_TX.png'

import './HistoryRecordErrorBoundary.css'

export default class HistoryRecordErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log('History Record Error: ', error, ' errorInfo: ', errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return (
            <animated.div className={classNames(this.props.className, "recordErrorBoundary")} style={this.props.style}>
                <img src={QuinnEmote} className="quinnEmote" />
                <div>Unknown error with match...</div>
            </animated.div>
        )
      }
  
      return this.props.children; 
    }
}