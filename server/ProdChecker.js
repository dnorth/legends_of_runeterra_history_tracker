const isElectronDev = require('electron-is-dev')

const IS_PROD = !isElectronDev || (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production');

module.exports = {
    IS_PROD
}