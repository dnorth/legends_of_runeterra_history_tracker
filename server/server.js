const express = require('express');
const jsonwebtoken = require('jsonwebtoken');

const { twitchJWT } = require('./secrets');
const { getLoRClientAPI } = require('./utils');

const app = express();

const secret = Buffer.from(twitchJWT, 'base64');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    // Note that the origin of an extension iframe will be null
    // so the Access-Control-Allow-Origin has to be wildcard.
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api/gameResult', async (req,res) => {
    const result = await getLoRClientAPI('game-result')
    res.send(result);
});

app.get('/api/positionalRectangles', async (req,res) => {
    const result = await getLoRClientAPI('positional-rectangles')
    res.send(result);
});

app.get('/api/staticDecklist', async (req,res) => {
    const result = await getLoRClientAPI('static-decklist')
    res.send(result);
});


app.get('/', (req, res) => {
    res.send('Alive and well!');
})

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);