import React from 'react'
import { useLocation } from 'react-router-dom';

import HeaderNav from './HeaderNav'

const SingleRecordView = () => {
    const location = useLocation();

    const { record } = location.state;

    return (
        <>
        <HeaderNav />
        <div>Hello, {record.playerName}!</div>
        </>
    )
}

export default SingleRecordView