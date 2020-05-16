import React from 'react'

import ShareDeckButton from './ShareDeckButton'
import DetailCounter from './DetailCounter';

import ChampionIcon from '../../images/Bacon_Icons-Champ.png'
import FollowerIcon from '../../images/Bacon_Icons-Follower.png'
import SpellIcon from '../../images/Bacon_Icons-Spell.png'

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

const DeckDetails = ({ record }) => {
    
    return (
        <>
            <div className="cardCountContainer">
                <CardType record={record} type="Champions" icon={ChampionIcon} />
                <CardType record={record} type="Followers" icon={FollowerIcon} />
                <CardType record={record} type="Spells" icon={SpellIcon} />
            </div>
            <ShareDeckButton record={record} />
        </>
    )
} 

export default DeckDetails;