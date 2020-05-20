const express = require('express');
const router = express.Router();
const axios = require('axios');
const Store = require('electron-store');

const { historyTrackerClientId, historyTrackerAPISecret } = require('../secrets');

const redirectUrl = 'https://127.0.0.1:6750/twitchAuth/authorize'

router.get('/authorize', async (req, res, next) => {
    const store = new Store()

    if(req.query.state !== 'thnksfrthmmrs' || !req.query.code) {
        res.sendStatus(403);
    }

    const accessCode = req.query.code;

    try {
        const authResponse = await axios.post(`https://id.twitch.tv/oauth2/token`, null, { 
            params: {
                client_id: historyTrackerClientId,
                client_secret: historyTrackerAPISecret,
                code: accessCode,
                grant_type: 'authorization_code',
                redirect_uri: redirectUrl
            }
        });
        
        const data = authResponse.data;

        const axiosInstance = axios.create({
            baseURL: 'https://api.twitch.tv/helix/users',
            headers: {
                'Authorization': 'Bearer ' + data.access_token,
                "Client-ID": historyTrackerClientId
            }
        })

        const userInfoResponse = await axiosInstance.get();
        const authenticatedTwitchUser = userInfoResponse && userInfoResponse.data && userInfoResponse.data.data && userInfoResponse.data.data[0];

        store.set('authenticatedTwitchUser', { ...authenticatedTwitchUser, accessToken: data.access_token, refreshToken: data.refresh_token });

        res.send('User Successfully Authenticated! You can close this window.');
    } catch (e) {
        res.send(e.response ? e.response.data : e.message);
    }
});

module.exports = router;