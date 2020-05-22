const express = require('express');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser');
const { IS_PROD } = require('./ProdChecker');

//Twitch Auth Config
const twitchAuthRoutes = require('./twitchAuth/routes')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get('/', (req, res) => {
    res.send('Alive and well!');
});

if(!IS_PROD) {
    //DynamoDb Config
    const AWS = require('aws-sdk');
    const dynamoDBRoutes = require('./dynamodb/routes');
    const dynamoDBConfig = require('./dynamodb/config/config');
    AWS.config.update(dynamoDBConfig.aws_local_config);
    app.use('/db', dynamoDBRoutes);
}

app.use('/twitchAuth', twitchAuthRoutes);

const port = process.env.PORT || 6750;

app.listen(port, () => console.log('App is listening on port ', port))

const LoRHistoryTracker = require('./LoRHistoryTracker');

const lorHistoryTracker = new LoRHistoryTracker();

lorHistoryTracker.startTrackingHistory(1000);

