import React, { useRef } from 'react'

import './ShareDeckButton.css'

import DeckShareButton from '../../images/Btn_Secondary_Face_Highlight.png';

import { useToastManager } from './ToastManager'

const ShareDeckButton = (props) => {
    const deckCodeRef = useRef(null);
    const { addToast } = useToastManager();

    const copyCodeToClipboard = () => {
        deckCodeRef.current.select();
        document.execCommand("copy");
        addToast('Successfully Copied Deck to Clipboard!')
        //display toast
    }
    
    return (
        <>
            <div className="deckCode">{props.record.deckCode}</div>
            <div className="shareContainer" title="Copy Deck Code to Clipboard" onClick={copyCodeToClipboard}>
                <img src={DeckShareButton} className="shareButton"/>
                <div className="copyDeckText">COPY TO CLIPBOARD</div>
            </div>
            <input className="hiddenDeckCode" ref={deckCodeRef} value={props.record.deckCode} readOnly/>
        </>
    )
}

export default ShareDeckButton