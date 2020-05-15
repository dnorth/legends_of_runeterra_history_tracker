import React from 'react'
import { useLocation } from 'react-router-dom';

import './SingleRecordView.css'

const Card = ({ card }) => {
    const srcIfExists = card.assets && card.assets[0] && card.assets[0].gameAbsolutePath 

    return (
        <img width="200px" src={srcIfExists} />
    )
}

const Cards = ({ record }) => (
    <div className="cardContainer">
    {
        record.getDetailedDeckInfo().map(card => <Card card={card} />)
    }
    </div>
)

const SingleRecordView = () => {
    const location = useLocation();

    const { record } = location.state;
    return (
        <div className="singleRecordView">
            <div>{record.playerName} VS {record.opponentName}</div>
            <Cards record={record} />
        </div>
    )
}

export default SingleRecordView