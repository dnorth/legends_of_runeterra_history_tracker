import React, { useState, useRef } from 'react'

import ShareDeckButton from './ShareDeckButton'
import DetailCounter from './DetailCounter';
import ClientHistoryRecord from '../ClientHistoryRecord';

import ChampionIcon from '../../images/Bacon_Icons-Champ.png'
import FollowerIcon from '../../images/Bacon_Icons-Follower.png'
import SpellIcon from '../../images/Bacon_Icons-Spell.png'
import ChampOverlay from '../../images/PlayerQueuePanel_Ring_TX.png'

import './DeckDetails.css'

const CardType = ({ record, type, icon }) => {
    const cardTypeCount = record.getCardTypeCount();

    return (
        <div className="cardTypeContainer">
            <div className="cardTypeText">{type}</div>
            <DetailCounter count={cardTypeCount[type].count}>
                <img src={icon} className="cardCountItem" />
            </DetailCounter>
        </div>
    )
}

const ChampionProfilePic = ({ champ }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageFound, setImageFound] = useState(true);

    return (
            <DetailCounter count={`x${champ.count}`} size={34} bottomOffset={4} rightOffset={0} show={imageLoaded}>
                <div title={champ.name} className="champPfpOverlayContainer">
                    <img className="champPfp" src={imageFound ? ClientHistoryRecord.getCardProfilePicUrl(champ.code) : ChampionIcon} onLoad={() => setImageLoaded(true)} onError={() => setImageFound(false)}/>
                    {
                        imageFound
                        ? imageLoaded ? < img className="champOverlay" src={ChampOverlay} /> : null
                        : <div className="champNotFoundName">{champ.name}</div>
                    }
                </div>
            </DetailCounter>
    )
}

const ChampionProfilePics = ({ record }) => {
    const { Champions } = record.getCardTypeCount();

    return (
        <div className="champPfpContainer">
            {Champions.items.map(champ => <ChampionProfilePic champ={champ} key={champ.code} />)}
        </div>
    )
}

const DeckDetails = ({ record }) => {
    
    return (
        <>
            <div className="cardCountContainer">
                <CardType record={record} type="Champions" icon={ChampionIcon} />
                <CardType record={record} type="Followers" icon={FollowerIcon} />
                <CardType record={record} type="Spells" icon={SpellIcon} />
            </div>
            <ChampionProfilePics record={record} />
            {
                record.deckCode && <ShareDeckButton record={record} />
            }
        </>
    )
} 

export default DeckDetails;