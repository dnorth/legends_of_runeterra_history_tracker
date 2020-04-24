import React, { useState, useEffect } from 'react'

import './WinTracker.css'

import { useInterval } from './custom-hooks.util'

const WinTracker = () => {
    let [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:5000/api/gameResult')
            const data = await response.json();

            setData(data)
        }

        fetchData();
      }, []);

    return (
        <div className="winTrackerContainer">
            Hello World! Here is the fetch data: {data.GameID}
        </div>
    )
}

export default WinTracker