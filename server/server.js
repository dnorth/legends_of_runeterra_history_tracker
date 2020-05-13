const express = require('express');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const IS_PROD = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production';

//DynamoDb Config
const dynamoDBRoutes = require('./dynamodb/routes');
const dynamoDBConfig = require('./dynamodb/config/config');
AWS.config.update(IS_PROD ? dynamoDBConfig.aws_remote_config : dynamoDBConfig.aws_local_config);


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
    res.send('Alive and well!');
})

app.use('/db', dynamoDBRoutes);

const port = process.env.PORT || 6750;

const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app)
.listen(port, () => {
    console.log('App is listening on port ' + port)
});

const broadcasterChannelId = 45279752;

const LoRHistoryTracker = require('./LoRHistoryTracker');

const lorHistoryTracker = new LoRHistoryTracker(broadcasterChannelId);

lorHistoryTracker.startTrackingHistory(1000);

