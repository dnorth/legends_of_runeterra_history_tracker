'use strict';

const { verifyBroadcaster, authenticateTwitchUser, getFormattedResponse } = require('./utils');

module.exports.authenticateTwitchUser = async event => {
    const accessCode = event.queryStringParameters && event.queryStringParameters.accessCode;
    const redirectUrl = event.queryStringParameters && event.queryStringParameters.redirectUrl;

    const { accessToken, refreshToken } = await authenticateTwitchUser(accessCode, redirectUrl);
    console.log('access token: ', accessToken, 'refresh token: ', refreshToken)
    const { authenticatedTwitchUser } = await verifyBroadcaster(accessToken, refreshToken);

    if(authenticatedTwitchUser) {
        return getFormattedResponse(200, {
            message: 'Successfully Authenticated!',
            authenticatedTwitchUser: { ...authenticatedTwitchUser, accessToken, refreshToken }
        })
    } else {
        return getFormattedResponse(401, {
            message: 'something went wrong during the authentication process...',
        })
    }
}