const path = require('path');
const { nativeImage } = require('electron');

const getPath = (relativePath) => path.join(__dirname, relativePath);

const getNativeImage = (relativePath) => nativeImage.createFromPath(getPath(relativePath));

module.exports = {
    getNativeImage
}