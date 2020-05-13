const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
var express = require('express');
var router = express.Router();

const dynamoDBConfig = require('./config/config');
const { winTrackerSecret, historyTrackerSecret } = require('../secrets');

const bearerPrefix = "Bearer ";

const responseCallback = (err, data, res) => {
    if (err) {
        res.send({
            success: false,
            message: err.message
        })
    } else {
        const { Items } = data;

        res.send({ data: Items });
    }
}

const verifyAndDecode = (base64EncodedSecret, header) => {
    const secret = Buffer.from(base64EncodedSecret, 'base64');

    if (header && header.startsWith(bearerPrefix)) {
        try {
            const token = header.substring(bearerPrefix.length);
            return jwt.verify(token, secret, { algorithms: ["HS256"] });
        } catch (e) {
            console.log('\n\n\n error: ', e);
          return null;
        }
    }

    return null;
}

router.get('/history', (req, res, next) => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const base64EncodedSecret = req.headers['requesting-client'] === 'Win Tracker' ? winTrackerSecret : historyTrackerSecret;

    const decodedJwt = verifyAndDecode(base64EncodedSecret, req.headers && req.headers.authorization);

    const channelId = decodedJwt.channel_id;

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
            ":twitchChannelId": channelId,
            ":from": from,
            ":to": to
        },
        Limit: 30,
    };

    docClient.query(params, (err, data) => responseCallback(err, data, res));
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