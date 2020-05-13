import React, { useState } from 'react'
import classNames from 'classnames'
import GameStateTypes from '../game-state.types';
import { useInterval } from '../../util/custom-hooks.util'

import './HistoryRecordView.css'

const getGameStateText = (record) => {
    const typeMap = {
        [GameStateTypes.INPROGRESS]: 'In Progress',
        [GameStateTypes.VICTORY]: 'Victory',
        [GameStateTypes.DEFEAT]: 'Defeat'
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

const HistoryRecordView = ({ record }) => {
    const classes = classNames('recordContainer', { 'playerWon': record.gameState === GameStateTypes.VICTORY, 'playerLost': record.gameState === GameStateTypes.DEFEAT, 'inProgress': record.gameState === GameStateTypes.INPROGRESS })

    return (
        <div className={classes}>
            <div className="leftSide">
                { record.gameState !== GameStateTypes.INPROGRESS &&
                    (
                        <>
                            <div className="timeSinceGame ellipsis" title={record.localGameStartTimeFormatted}>{record.timeSinceGame}</div>
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
                VS {record.opponentName}
            </div>
        </div>
    )
}

export default HistoryRecordView