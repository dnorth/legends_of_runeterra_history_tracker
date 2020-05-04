const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const socketIO = require('socket.io');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

const dynamoDBRoutes = require('./dynamodb/routes');

const LoRHistoryTracker = require('./LoRHistoryTracker');

const app = express();

app.use(bodyParser());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    // Note that the origin of an extension iframe will be null
    // so the Access-Control-Allow-Origin has to be wildcard.
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

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

const io = socketIO(server);

const lorHistoryTracker = new LoRHistoryTracker(io);

io.on('connection', (socket) => {
    socket.emit('onHistoryUpdated', lorHistoryTracker.history);

    socket.on('disconnect', () => {
    })
})


lorHistoryTracker.startTrackingHistory(1000);

