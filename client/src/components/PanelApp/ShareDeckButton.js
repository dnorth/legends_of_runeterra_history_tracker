import React, { useRef } from 'react'
import ShareIcon from '../../images/share_icon.png';
import PurchaseButton from '../../images/PurchaseButton_256x256.png';

import './ShareDeckButton.css'

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
            <div className="shareContainer" title="Copy Deck Code to Clipboard" onClick={copyCodeToClipboard}>
                <img src={PurchaseButton} height="36px" width="36px" className="shareButton" />
                <img src={ShareIcon} height="28px" width="28px" className="shareIcon" />
            </div>
            <input className="hiddenDeckCode" ref={deckCodeRef} value={props.record.deckCode} readOnly/>
        </>
    )
}

export default ShareDeckButton