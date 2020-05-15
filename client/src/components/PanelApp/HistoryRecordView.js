import React, { useState } from 'react'
import classNames from 'classnames'
import GameStateTypes from '../game-state.types';
import { useInterval } from '../../util/custom-hooks.util'

import ShareDeckButton from './ShareDeckButton';

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

const FactionImage = ({ src }) => (
    <img height="30px" width="30px" src={src} />
)

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

const HistoryRecordView = ({ record, onDeckCopy }) => {
    const classes = classNames('recordContainer', { 
        'playerWon': record.gameState === GameStateTypes.VICTORY,
        'playerLost': record.gameState === GameStateTypes.DEFEAT,
        'inProgress': record.gameState === GameStateTypes.INPROGRESS,
        'probableError': record.gameState === GameStateTypes.ERROR
    })

    const errorTitle = record.gameState === GameStateTypes.ERROR ? { title: 'Looks like something went wrong when trying to collect game data for this record...'} : {}

    return (
        <div className={classes} {...errorTitle}>
            <div className="leftSide">
                { record.gameEndedSuccessfully &&
                    (
                        <>
                            <div className="timeSinceGame ellipsis" title={record.localGameEndTimeFormatted}>{record.timeSinceGame}</div>
                            <div className="bar" />
                        </>
                    )
                }
                <div className="resultsContainer">
                    {getGameStateText(record)}
                </div>
                { record.gameState === GameStateTypes.INPROGRESS ? <GameLengthInProgress record={record} /> : <GameLength gameLength={record.gameLength} /> }
            </div>
            <div className="factionsContainer">
                {
                    record.getDeckFactionImageUrls().map(url => <FactionImage src={url} key={url}/>)
                }
            </div>
            <div className="opponentContainer">
                <div>VS</div>
                <div className="opponentName">{record.opponentName}</div>
            </div>
            <ShareDeckButton record={record} />
        </div>
    )
}

export default HistoryRecordView