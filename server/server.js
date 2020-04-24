const express = require('express');
const path = require('path');
const cors = require('cors')
const request = require('request')

const app = express();

app.use(cors())

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/gameResult', (req,res) => {

    request('http://127.0.0.1:21337/game-result', function (error, response, body) {
        if( error ) {
            if( error.code === 'ECONNREFUSED') {
                res.status(502).send('Cannot detect that Legends of Runeterra is open.')
            } else {
                res.status(502).send(error.code)
            }
        } else {
            res.send(body)
        }
    })
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);