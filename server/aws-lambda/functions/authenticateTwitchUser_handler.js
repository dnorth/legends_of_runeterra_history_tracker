'use strict';

const { verifyBroadcaster, authenticateTwitchUser, getFormattedResponse } = require('./utils');

module.exports.authenticateTwitchUser = async event => {
    const accessCode = event.queryStringParameters && event.queryStringParameters.accessCode;
    const redirectUrl = event.queryStringParameters && event.queryStringParameters.redirectUrl;

    const { accessToken, refreshToken } = await authenticateTwitchUser(accessCode, redirectUrl);
    const { authenticatedTwitchUser } = await verifyBroadcaster(accessToken, refreshToken);

    if(authenticatedTwitchUser) {
        console.log(`Successfully authenticated twitch user ${JSON.stringify(authenticatedTwitchUser)}!`)
        return getFormattedResponse(200, {
            message: 'Successfully Authenticated!',
            authenticatedTwitchUser: { ...authenticatedTwitchUser, accessToken, refreshToken }
        })
    } else {
        console.log(`something went wrong during the authentication process... We don't have an authenticated twitch user.`);
        return getFormattedResponse(401, {
            message: 'something went wrong during the authentication process...',
        })
    }
}