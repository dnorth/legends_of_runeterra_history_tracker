const AWS = require('aws-sdk');
var express = require('express');
var router = express.Router();

const dynamoDBConfig = require('./config/config');

router.get('/history', (req, res, next) => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: dynamoDBConfig.lor_history_table_name
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.send({
                success: false,
                message: err.message
            })
        } else {
            const { Items } = data;

            //TODO: server should be sorting these...
            const sortedItems = Items.sort((a, b) => b.gameStartTimestamp - a.gameStartTimestamp);
            res.send(sortedItems);
        }
    })
});

module.exports = router;