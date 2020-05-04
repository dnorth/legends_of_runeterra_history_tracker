const AWS = require('aws-sdk');
var express = require('express');
var router = express.Router();

const dynamoDBConfig = require('./config/config');
const isDev = process.env.NODE_ENV !== 'production';

router.get('/fruits', (req, res, next) => {
    AWS.config.update(isDev ? dynamoDBConfig.aws_local_config : dynamoDBConfig.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: dynamoDBConfig.aws_table_name
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            res.send({
                success: false,
                message: err.message
            })
        } else {
            const { Items } = data;

            res.send({
                success: true,
                message: 'Loaded fruits',
                fruits: Items
            })
        }
    })
});

router.post('/fruit', (req, res, next) => {
    console.log('request: ', req);
    AWS.config.update(isDev ? dynamoDBConfig.aws_local_config : dynamoDBConfig.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const { type, color } = req.body;

    const fruitId = (Math.random() * 1000).toString();

    const params = {
        TableName: dynamoDBConfig.aws_table_name,
        Item: {
            fruitId: fruitId,
            fruitType: type,
            color: color
        }
    }

    docClient.put(params, (err, data) => {
        if (err) {
            res.send({
                success: false,
                message: err.message
            })
        } else {
            console.log('data: ', data);
            const { Items } = data;

            res.send({
                success: true,
                message: 'Added Fruit',
                fruitId: fruitId
            })
        }
    })
})

module.exports = router