const express = require('express');
const router = express.Router();
const axios = require('axios');
const TwitchAuth = require('./TwitchAuth');
const { IS_PROD } = require('../ProdChecker');

const { historyTrackerClientId, historyTrackerAPISecret } = require('../secrets');

router.get('/authorize', async (req, res, next) => {

    if(req.query.state !== 'thnksfrthmmrs' || !req.query.code) {
        res.sendStatus(403);
    }

    const accessCode = req.query.code;

    const authMethod = IS_PROD ? getTwitchAuthProd : getTwitchAuthLocal;

    try {
        const authenticatedTwitchUser = await authMethod(accessCode);

        TwitchAuth.updateAuthenticatedUser(authenticatedTwitchUser);

        res.send(`You've successfully authenticated to the Legends of Runeterra History Tracker as ${authenticatedTwitchUser.display_name}! You can close this window.`);
    } catch (e) {
        const errorMessage = e.response ? e.response.data : e.message;
        res.send({ message: 'Something went wrong with the authentication process... Please try again.', errorMessage });
    }
});

const getTwitchAuthLocal = async (accessCode) => {
    try {
        const authResponse = await axios.post(`https://id.twitch.tv/oauth2/token`, null, { 
            params: {
                client_id: historyTrackerClientId,
                client_secret: historyTrackerAPISecret,
                code: accessCode,
                grant_type: 'authorization_code',
                redirect_uri: TwitchAuth.redirectUrl
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

        return { ...authenticatedTwitchUser, accessToken: data.access_token, refreshToken: data.refresh_token }
    } catch (e) {
        console.log('Had an error authenticating... ', (e.response && e.data) || e.message);
        return null;
    }
}

const getTwitchAuthProd = async (accessCode) => {
    try {
        const authResponse = await axios.post('https://n1lych6sf6.execute-api.us-east-2.amazonaws.com/production/authTwitchUser', null, {
            params: {
                redirectUrl: TwitchAuth.redirectUrl,
                accessCode
            }
        });

        const data = authResponse.data || {};
        return data.authenticatedTwitchUser;
    } catch(e) {
        console.log('Had an error authenticating... ', (e.response && e.data) || e.message);
        return null;
    }
}

module.exports = router;