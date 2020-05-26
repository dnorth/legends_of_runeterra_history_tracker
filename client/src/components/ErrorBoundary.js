import React from 'react';

import './ErrorBoundary.css'

import SadPoro from '../images/poro_sad_icon_TX.png';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log('error: ', error, ' errorInfo: ', errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
            <div className="errorBoundary">
                <img src={SadPoro} className="sadPoroBoi" />
                Looks like something didn't work quite right!
            </div>
        )
      }
  
      return this.props.children; 
    }
}