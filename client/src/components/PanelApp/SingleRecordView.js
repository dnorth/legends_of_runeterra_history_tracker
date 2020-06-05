import React, { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';

import ClientHistoryRecord from '../ClientHistoryRecord';
import StickyBackground from './StickyBackground';
import VSButton from './VSButton';
import FactionImages from './FactionImages'
import DeckDetails from './DeckDetails'
import DetailCounter from './DetailCounter'
import Divider from '../Divider'
import ErrorBoundary from '../ErrorBoundary';

import './SingleRecordView.css'
import PanelHistoryTracker from './PanelHistoryTracker';
import DefaultCard from '../../images/card-back.png'

const Card = ({ card }) => {
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef(null);

    const srcIfExists = card.assets && card.assets[0] && card.assets[0].gameAbsolutePath;
    const imgLoaded = imgRef.current && imgRef.current.complete && !imageError;

    return (
        <DetailCounter count={`x${card.count}`} size={34} bottomOffset={258} rightOffset={-11} variant="card">
            <div className="cardContainer">
                {!imgLoaded && (
                    <div className="cardName">{card.name}</div>
                )}
                <img width="200px" ref={imgRef} src={imgLoaded && srcIfExists ? srcIfExists : DefaultCard} onError={() => setImageError(true)} />
            </div>
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
        <ErrorBoundary>
            <div>
                <StickyBackground />
                <div className="singleRecordView">
                    <div className="recordContent">
                        <div className="vsInfo">
                            <div>{record.playerName}</div>
                            <FactionImages record={record} size={34} overBackground />
                            <VSButton className="vsButton" />
                            <div>{record.opponentName}</div>
                        </div>
                        <Divider />
                        <DeckDetails record={record} />
                        <Cards record={record} />
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default SingleRecordView