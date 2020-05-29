'use strict';
const { verifyAndDecode, getFormattedResponse, getDynamoDbDocClient } = require('./utils')

module.exports.getLoRHistoryByChannelId = async event => {
  if(!event.headers || !event.headers['requesting-client']) {
    console.log('request made with invalid requesting client. Here are the headers: ', event.headers);
    return getFormattedResponse(400, {
      message: 'Valid Requesting Client Required.'
    })
  }

  const base64EncodedSecret = event.headers['requesting-client'] === 'Win Tracker' ? process.env.WIN_TRACKER_SECRET : process.env.HISTORY_TRACKER_SECRET;

  const decodedJwt = verifyAndDecode(base64EncodedSecret, event.headers && event.headers.Authorization);

  if (decodedJwt) {
    const channelId = decodedJwt.channel_id;

    const docClient = getDynamoDbDocClient();

    const maybeQueryFrom = event.queryStringParameters && event.queryStringParameters.from;
    const maybeQueryTo = event.queryStringParameters && event.queryStringParameters.to;

    const from = maybeQueryFrom || new Date().toISOString();

    const MAX_DAYS_TO_QUERY = 30;

    const maxDaysAgo = new Date(new Date().setDate(new Date().getDate() - MAX_DAYS_TO_QUERY)).toISOString(); //haha, lovely.
    const maybeTo = maybeQueryTo || maxDaysAgo;

    const to = maybeTo < maxDaysAgo ? maxDaysAgo : maybeTo; //Limit to last MAX_DAYS_TO_QUERY days.
    
    const params = {
        TableName: 'LoRHistory',
        KeyConditionExpression: 'twitchChannelId = :twitchChannelId AND gameStartTimestamp BETWEEN :to AND :from',
        ScanIndexForward: false,
        ExpressionAttributeValues: {
            ":twitchChannelId": channelId,
            ":from": from,
            ":to": to
        },
        Limit: 30,
    };

    try {
      const response = await docClient.query(params).promise();

      console.log(`successfully requested data for channel ${channelId}.`);

      return getFormattedResponse(200, {
        data: response.Items
      })

    } catch(error) {
      console.log(`Something went wrong when trying to request data... Here is the error: ${error}`);
      return getFormattedResponse(500, {
          errorMessage: error && error.message,
          message: 'Could not get items...',
          data: []
        })
    }
  } else {
    console.log('invalid twitch user requesting data. Here are the headers: ', event.headers);
    return getFormattedResponse(401, {
      message: 'Valid JWT required.'
    })
  }
};
