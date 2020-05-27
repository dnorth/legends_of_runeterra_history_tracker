const path = require('path');
const { nativeImage } = require('electron');

const getPath = (relativePath) => path.join(__dirname, relativePath);

const getNativeImage = (relativePath) => nativeImage.createFromPath(getPath(relativePath));

const isEmptyObject = (item) =>  typeof item === 'object' ? Object.getOwnPropertyNames(item).length === 0 : false;

module.exports = {
    getNativeImage,
    isEmptyObject
}