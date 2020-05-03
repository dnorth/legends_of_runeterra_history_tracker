import React, { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client";

import TrackerData from './TrackerData';

const LOCAL_SERVER = "http://127.0.0.1:6750/";

const TrackerDataFetcher = (props) => {
    const [trackerData, setTrackerData] = useState([]);

    useEffect(() => {
        const socket = socketIOClient(LOCAL_SERVER);
        socket.on("onHistoryUpdated", newFullHistory => {
            setTrackerData(newFullHistory);
        })
    }, []);

    return (
        <>
            {props.children(new TrackerData(trackerData))}
        </>
    )
}

export default TrackerDataFetcher