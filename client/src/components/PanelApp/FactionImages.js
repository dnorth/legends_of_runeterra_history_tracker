import React from 'react';

import './FactionImages.css';

const FactionImage = ({ src, size }) => (
    <img height={`${size}px`} width={`${size}px`} src={src} />
)

const FactionImages = ({ record, size }) => (
    <div className="factionsContainer">
        {
            record.getDeckFactionImageUrls().map(url => <FactionImage src={url} key={url} size={size} />)
        }
    </div>
)

FactionImages.defaultProps = {
    size: 30
}

export default FactionImages