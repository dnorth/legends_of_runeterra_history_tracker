import React, { useState, useRef } from 'react';
import classNames from 'classnames';

import AllRegionImage from '../../images/region-all.png';

import './FactionImages.css';

const FactionImage = ({ src, size, name, overBackground }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef(null);

    const imgLoaded = imgRef.current && imgRef.current.complete && !imageError;

    return (
        <div className="factionsContainer">
            {!imgLoaded && (
                <div className={classNames("factionName", { "overBackground": overBackground})}>{name}</div>
            )}
            <img ref={imgRef} height={`${size}px`} width={`${size}px`} src={imgLoaded && src ? src : AllRegionImage} onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
        </div>
    )
}

const FactionImages = ({ record, size, overBackground }) => (
    <div className="factionsContainer">
        {
            record.getDeckFactionImageUrls().map(({ url, shortCode }) => <FactionImage src={url} name={shortCode} key={url} size={size} overBackground={overBackground} />)
        }
    </div>
)

FactionImages.defaultProps = {
    size: 30,
    overBackground: false
}

export default FactionImages