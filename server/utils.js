const path = require('path');

const getPath = (relativePath) => path.join(__dirname, relativePath);

module.exports = {
    getPath
}