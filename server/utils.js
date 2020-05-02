const path = require('path');
const axios = require('axios');

const DEFAULT_LOR_PORT = 21337;

const getPath = (relativePath) => path.join(__dirname, relativePath);

const getLoRClientAPI = async (path, port) => {
    const lorPort = port || DEFAULT_LOR_PORT;

    try {
        const response = await axios.get(`http://127.0.0.1:${lorPort}/${path}`);
        return response.data;
    } catch(e) {
        if( e.code === 'ECONNREFUSED') {
            return { message: `Cannot detect that Legends of Runeterra is open. Please ensure that you have Third Party Tools enable and that it is set to ${lorPort}.` }
        } else {
            return { message: e.message, code: e.code }
        } 
    }
}

module.exports = {
    getPath,
    getLoRClientAPI
}