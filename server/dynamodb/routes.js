const AWS = require('aws-sdk');
var express = require('express');
var router = express.Router();

const dynamoDBConfig = require('./config/config');

const responseCallback = (err, data, res) => {
    if (err) {
        res.send({
            success: false,
            message: err.message
        })
    } else {
        const { Items } = data;

        res.send(Items);
    }
}

router.get('/history', (req, res, next) => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: dynamoDBConfig.lor_history_table_name
    };

    docClient.scan(params, (err, data) => responseCallback(err, data, res));
});

router.get('/history/:twitchChannelId', (req, res, next) => {
    const docClient = new AWS.DynamoDB.DocumentClient();
    const from = req.query.from || new Date().toISOString();

    const MAX_DAYS_TO_QUERY = 30;

    const maxDaysAgo = new Date(new Date().setDate(new Date().getDate() - MAX_DAYS_TO_QUERY)).toISOString(); //haha, lovely.
    const maybeTo = req.query.to || maxDaysAgo;

    const to = maybeTo < maxDaysAgo ? maxDaysAgo : maybeTo; //Limit to last MAX_DAYS_TO_QUERY days.
    
    const params = {
        TableName: dynamoDBConfig.lor_history_table_name,
        KeyConditionExpression: 'twitchChannelId = :twitchChannelId AND gameStartTimestamp BETWEEN :to AND :from',
        ScanIndexForward: false,
        ExpressionAttributeValues: {
            ":twitchChannelId": req.params.twitchChannelId,
            ":from": from,
            ":to": to
        },
        Limit: 50,
    };

    docClient.query(params, (err, data) => responseCallback(err, data, res));
})

module.exports = router;