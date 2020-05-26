import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';

import ClientHistoryRecord from '../ClientHistoryRecord';
import StickyBackground from './StickyBackground';
import VSButton from './VSButton';
import FactionImages from './FactionImages'
import DeckDetails from './DeckDetails'
import DetailCounter from './DetailCounter'
import Divider from '../Divider'

import './SingleRecordView.css'
import PanelHistoryTracker from './PanelHistoryTracker';

const Card = ({ card }) => {
    const [showDetailCounter, setShowDetailCounter] = useState(false);

    const srcIfExists = card.assets && card.assets[0] && card.assets[0].gameAbsolutePath;

    return (
        <DetailCounter count={`x${card.count}`} size={34} bottomOffset={140} rightOffset={-10} show={showDetailCounter}>
            <img width="200px" src={srcIfExists} onLoad={() => setShowDetailCounter(true)}/>
        </DetailCounter>
    )
}

const Cards = ({ record }) => (
    <div className="cardContainer">
    {
        record.getDetailedDeckInfo().map(card => <Card key={card.code} card={card} />)
    }
    </div>
)

const SingleRecordView = (props) => {
    const location = useLocation();
    const { record } = location.state;

    return (
        <div>
            <StickyBackground />
            <div className="singleRecordView">
                <div className="recordContent">
                    <div className="vsInfo">
                        <div>{record.playerName}</div>
                        <FactionImages record={record} size={34} />
                        <VSButton className="vsButton" />
                        <div>{record.opponentName}</div>
                    </div>
                    <Divider />
                    <DeckDetails record={record} />
                    <Cards record={record} />
                </div>
             </div>
        </div>
    )
}

export default SingleRecordView