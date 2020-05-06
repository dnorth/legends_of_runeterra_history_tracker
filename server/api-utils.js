const axios = require('axios');
const AWS = require('aws-sdk');

const LoRStatusChecker = require('./StatusChecker');

const DEFAULT_LOR_PORT = 21337;

const getLoRClientAPI = async (path, port) => {
    const lorPort = port || DEFAULT_LOR_PORT;

    try {
        const response = await axios.get(`http://127.0.0.1:${lorPort}/${path}`);
        LoRStatusChecker.status = true;
        return response.data;
    } catch(e) {
        if( e.code === 'ECONNREFUSED') {
            LoRStatusChecker.status = false;

            return { message: `Cannot detect that Legends of Runeterra is open. Please ensure that you have Third Party Tools enable and that it is set to ${lorPort}.` }
        } else {
            return { message: e.message, code: e.code }
        } 
    }
}

const addOrUpdateHistoryRecordToDynamoDB = (recordToUpdate) => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    docClient.put(recordToUpdate.dynamoDbBasicParams, (err, data) => {
        if (err) {
            console.log('error adding record...', err.message);
        } else {
            console.log(`successfully added/updated record ${recordToUpdate.id}!`);
        }
    });
}

module.exports = {
    getLoRClientAPI,
    addOrUpdateHistoryRecordToDynamoDB
}