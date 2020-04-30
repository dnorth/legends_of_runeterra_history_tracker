const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const path = require('path');
const request = require('request');
const { twitchJWT } = require('./secrets');

const app = express();

const secret = Buffer.from(twitchJWT, 'base64');
const defaultLoRPort = 21337;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    // Note that the origin of an extension iframe will be null
    // so the Access-Control-Allow-Origin has to be wildcard.
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api/gameResult', (req,res) => {
    const lorPort = req.query.port || defaultLoRPort;

    request(`http://127.0.0.1:${lorPort}/game-result`, function (error, response, body) {
        if( error ) {
            if( error.code === 'ECONNREFUSED') {
                res.status(502).send({ message: 'Cannot detect that Legends of Runeterra is open. Please ensure that you have Third Party Tools enable and that it is set to 21337.' })
            } else {
                res.status(502).send(error.code)
            }
        } else {
            res.send(body)
        }
    })
});

app.get('/api/positionalRectangles', (req,res) => {
    const lorPort = req.query.port || defaultLoRPort;

    request(`http://127.0.0.1:${lorPort}/positional-rectangles`, function (error, response, body) {
        if( error ) {
            if( error.code === 'ECONNREFUSED') {
                res.status(502).send({ message: 'Cannot detect that Legends of Runeterra is open. Please ensure that you have Third Party Tools enable and that it is set to 21337.' })
            } else {
                res.status(502).send(error.code)
            }
        } else {
            res.send(body)
        }
    })
});

app.get('/api/staticDecklist', (req,res) => {
    const lorPort = req.query.port || defaultLoRPort;

    request(`http://127.0.0.1:${lorPort}/static-decklist`, function (error, response, body) {
        if( error ) {
            if( error.code === 'ECONNREFUSED') {
                res.status(502).send({ message: 'Cannot detect that Legends of Runeterra is open. Please ensure that you have Third Party Tools enable and that it is set to 21337.' })
            } else {
                res.status(502).send(error.code)
            }
        } else {
            res.send(body)
        }
    })
});


app.get('/', (req, res) => {
    res.send('Alive and well!');
})

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);