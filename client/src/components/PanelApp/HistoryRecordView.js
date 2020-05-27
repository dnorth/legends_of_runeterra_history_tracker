import React, { useState } from 'react'
import classNames from 'classnames'
import GameStateTypes from '../game-state.types';
import { useInterval } from '../../util/custom-hooks.util'
import { animated } from 'react-spring';
import { Link } from 'react-router-dom'

import FactionImages from './FactionImages';
import ShareDeckButton from './ShareDeckButton';
import Chevron from './Chevron';
import HistoryRecordErrorBoundary from './HistoryRecordErrorBoundary';

import './HistoryRecordView.css'

const getGameStateText = (record) => {
    const typeMap = {
        [GameStateTypes.INPROGRESS]: 'In Progress',
        [GameStateTypes.VICTORY]: 'Victory',
        [GameStateTypes.DEFEAT]: 'Defeat',
        [GameStateTypes.ERROR]: 'Error'
    }

    return typeMap[record.gameState]
}

const GameLengthInProgress = ({ record }) => {
    const [newGameLength, setGameLength] = useState(record.gameLength)

    useInterval(() => {
        setGameLength(record.gameLength)
    }, 1000)

    return <GameLength gameLength={newGameLength} />
}

const GameLength = ({ gameLength }) => (
    <div className="ellipsis">
        {gameLength}
    </div>
)

const getTitleText = (record, canSeeDeckDetails) => {
    let title = null;

    if (!canSeeDeckDetails) {
        title = 'No deck details available.'
    }

    if (record.gameState === GameStateTypes.ERROR) {
        title = 'Looks like something went wrong when trying to collect game data for this record.'
    }

    return title ? { title } : {}
}

const HistoryRecordView = ({ record, style }) => {
    const canSeeDeckDetails = record.deckCode || record.cardsInDeck;

    const classes = classNames('recordContainer', { 
        'playerWon': record.gameState === GameStateTypes.VICTORY,
        'playerLost': record.gameState === GameStateTypes.DEFEAT,
        'inProgress': record.gameState === GameStateTypes.INPROGRESS,
        'probableError': record.gameState === GameStateTypes.ERROR,
        'clickable': canSeeDeckDetails,
        'notClickable': !canSeeDeckDetails
    })

    return (
        <HistoryRecordErrorBoundary className="probableError" style={style}>
            <Link to={{ pathname: `/${record.id}`, state: { record }}} onClick={e => canSeeDeckDetails ? null : e.preventDefault()} className='recordLink'>
                <animated.div className={classes} {...getTitleText(record, canSeeDeckDetails)} style={style}>
                    <div className="leftSide">
                        { record.gameEndedSuccessfully &&
                            (
                                <>
                                    <div className="timeSinceGame ellipsis" title={record.localGameEndTimeFormatted}>{record.timeSinceGame}</div>
                                    <div className="historyViewBar" />
                                </>
                            )
                        }
                        <div className="resultsContainer">
                            {getGameStateText(record)}
                        </div>
                        { record.gameState === GameStateTypes.INPROGRESS ? <GameLengthInProgress record={record} /> : <GameLength gameLength={record.gameLength} /> }
                    </div>
                    <FactionImages record={record} />
                    <div className="opponentContainer">
                        <div>VS</div>
                        <div className="opponentName">{record.opponentName}</div>
                    </div>
                    {
                        canSeeDeckDetails && <Chevron />
                    }
                </animated.div>
            </Link>
        </HistoryRecordErrorBoundary>
    )
}

export default HistoryRecordView