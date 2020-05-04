const AWS = require('aws-sdk');
var express = require('express');
var router = express.Router();

const dynamoDBConfig = require('./config/config');
const isDev = process.env.NODE_ENV !== 'production';

router.get('/history', (req, res, next) => {
    AWS.config.update(isDev ? dynamoDBConfig.aws_local_config : dynamoDBConfig.aws_remote_config);

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