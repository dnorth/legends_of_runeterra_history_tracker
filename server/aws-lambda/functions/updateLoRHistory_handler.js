'use strict';

const { getFormattedResponse, broadcastToApplication, verifyBroadcasterWithRefresh, updateRecordInDb } = require('./utils');

module.exports.updateLoRHistory = async event => {
    const { authenticatedTwitchUser, newTokens } = await verifyBroadcasterWithRefresh(event.headers && event.headers.Authorization, event.queryStringParameters && event.queryStringParameters.refreshToken);

    if(authenticatedTwitchUser && event.body) {
        try {
            const bodyJSON = JSON.parse(event.body);
            const channelId = authenticatedTwitchUser.id;
    
            const finalBodyJSON = {
                ...bodyJSON,
                twitchChannelId: channelId //no funny business, please!
            }
    
            await updateRecordInDb(bodyJSON)
    
            const record = bodyJSON.Item;
            const message = JSON.stringify({"historyUpdated": { record, success: true } });
    
            await broadcastToApplication(process.env.WIN_TRACKER_CLIENT_ID, process.env.WIN_TRACKER_SECRET, channelId, message);
            await broadcastToApplication(process.env.HISTORY_TRACKER_CLIENT_ID, process.env.HISTORY_TRACKER_SECRET, channelId, message);
    
            return getFormattedResponse(200, {
                message: `Successfully updated and broadcasted record to channel ${channelId}!`,
                newAuthenticatedTwitchUser: newTokens ? { ...authenticatedTwitchUser, ...newTokens } : null
            })
        } catch (e) {
            return getFormattedResponse(502, {
                message: `Hmmm... something went wrong when trying to update and broadcast the record.`,
                errorMessage: e.message
            })
        }
    } else {
        return getFormattedResponse(401, {
            message: 'Valid auth token and body required.',
            invalidateUser: true
        })
    }
}