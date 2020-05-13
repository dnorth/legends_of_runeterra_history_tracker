import React, { useReducer, useEffect, useState } from 'react'

import TrackerData from './TrackerData';

const LOCAL_HISTORY_ENDPOINT = 'https://localhost:6750/db/history';
const PROD_HISTORY_ENDPOINT = "https://lmz0u3fo8a.execute-api.us-east-2.amazonaws.com/production/history";

const REAL_HISTORY_ENDPOINT = process.env.NODE_ENV === 'production' ? PROD_HISTORY_ENDPOINT : LOCAL_HISTORY_ENDPOINT;

const initialState = []

const addOrUpdateRecord = (trackerData, recordToUpdate) => {
    const indexIfRecordExistsInTrackerData = trackerData.findIndex(record => record.id === recordToUpdate.id);
    
    return indexIfRecordExistsInTrackerData !== -1 ? Object.assign(trackerData.slice(), { [indexIfRecordExistsInTrackerData]: recordToUpdate }) : [recordToUpdate, ...trackerData]
}

const reducer = (trackerData, action) => {
    const stateMap = {
        'addOrUpdateRecord': addOrUpdateRecord(trackerData, action.recordToUpdate),
        'setFullHistory': action.fullHistory
    }

    return stateMap[action.type] || trackerData;
}

const TrackerDataFetcher = (props) => {
    const [trackerData, dispatch] = useReducer(reducer, initialState); //necessary because we're updating on pub/sub and useState doesn't work.
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const { authentication } = props;

        const getFullHistoryOnLoad = async () => {
            try {
                const response = await authentication.makeCall(REAL_HISTORY_ENDPOINT, "GET", props.requestingClient);
                const responseBody = await response.json();

                dispatch({ type: 'setFullHistory', fullHistory: responseBody.data });
                setIsLoaded(true);
            } catch(e) {
                dispatch({ type: 'setFullHistory', fullHistory: [] });
                setIsLoaded(true);
            }
        }

        getFullHistoryOnLoad();

    }, []);

    useEffect(() => {
        const twitch = window.Twitch ? window.Twitch.ext : null

        if(twitch) {
            twitch.listen('broadcast',(target,contentType,body)=>{
                const parsedBody = JSON.parse(body);
    
                if(parsedBody.historyUpdated) {
                    const recordToUpdate = parsedBody.historyUpdated.record;
                    dispatch({ type: 'addOrUpdateRecord', recordToUpdate })
                }
            })
        }

        return () => {
            if(twitch) {
                twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
            }
        }
    }, []);

    return (
        <>
            {props.children({ trackerData: new TrackerData(trackerData), isLoaded })}
        </>
    )
}

export default TrackerDataFetcher