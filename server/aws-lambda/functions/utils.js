
const jwt = require("jsonwebtoken");
const AWS = require('aws-sdk');
const axios = require('axios');

const dynamoDBConfig = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production'
  ? { accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID, secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY, region: 'us-east-2' }
  : require('../../dynamodb/config/config').aws_local_config;

const bearerPrefix = "Bearer ";
const serverTokenDurationSec = 30;

const getDynamoDbDocClient = () => {
    return new AWS.DynamoDB.DocumentClient(dynamoDBConfig);
}

const verifyAndDecode = (base64EncodedSecret, header) => {
    const secret = Buffer.from(base64EncodedSecret, 'base64');

    if (header && header.startsWith(bearerPrefix)) {
        try {
            const token = header.substring(bearerPrefix.length);
            return jwt.verify(token, secret, { algorithms: ["HS256"] });
        } catch (e) {
          return null;
        }
    }

    return null;
}

const getFormattedResponse = (statusCode, message) => (
  {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Headers": "Authorization,Requesting-Client,Content-Type"
    },
    body: JSON.stringify(message, null, 4)
  }
)

function makeServerBroadcastToken(clientSecret, channelId) {
    var secret = Buffer.from(clientSecret, 'base64');

    const payload = {
      exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
      channel_id: "" + channelId,
      user_id: "" + channelId,
      role: "external",
      pubsub_perms: {
        send: ["broadcast"]
      }
    };
  
    return jwt.sign(payload, secret, { algorithm: "HS256" });
}

const broadcastToApplication = async (clientId, clientSecret, channelId, message) => {
    const headers = {
      "Client-Id": clientId,
      "Content-Type": "application/json",
      Authorization: bearerPrefix + makeServerBroadcastToken(clientSecret, channelId)
    };

    const body = JSON.stringify({
      content_type: 'application/json',
      message,
      targets: [ 'broadcast' ]
    });

    try {
      const response = await axios.post(`https://api.twitch.tv/extensions/message/${channelId}`, body, { headers });
      console.log(`broadcast to channel: ${channelId} ---> client: ${clientId} successful: ${response.status}`);
    } catch(e) {
        console.log('broadcast failed: ', e.message);
    }
}

const verifyBroadcasterWithRefresh = async (originalAccessToken, originalRefreshToken) => {
  let { authenticatedTwitchUser, attemptToRefresh } = await verifyBroadcaster(originalAccessToken, originalRefreshToken);

  if(attemptToRefresh) {
    return await attemptToRefreshToken(originalRefreshToken);
  } else {
    return { authenticatedTwitchUser }
  }
}

const verifyBroadcaster = async (accessToken, refreshToken) => {
    const bareAccessToken = trimBearerPrefixIfExists(accessToken);
  
    const axiosInstance = axios.create({
        baseURL: 'https://api.twitch.tv/helix/users',
        headers: {
            'Authorization': bearerPrefix + bareAccessToken,
            "Client-ID": process.env.HISTORY_TRACKER_CLIENT_ID
        }
    })

    try {
        const userInfoResponse = await axiosInstance.get();
        const authenticatedTwitchUser = userInfoResponse && userInfoResponse.data && userInfoResponse.data.data && userInfoResponse.data.data[0];

        return { authenticatedTwitchUser }; 
    } catch (e) {
        if(e.response && e.response.data && e.response.data.error === 'Unauthorized') {
          return { authenticatedTwitchUser: null, attemptToRefresh: true }
        }
        
        console.log('some unknown error: ', (e.response && e.response.data) || e.message);
        return { authenticatedTwitchUser: null };
    }
}

const authenticateTwitchUser = async (accessCode, redirectUrl) => {
  try {
    const authResponse = await axios.post(`https://id.twitch.tv/oauth2/token`, null, { 
      params: {
          client_id: process.env.HISTORY_TRACKER_CLIENT_ID,
          client_secret: process.env.HISTORY_TRACKER_API_SECRET,
          code: accessCode,
          grant_type: 'authorization_code',
          redirect_uri: redirectUrl
      }
    });

    const data = authResponse.data || {}

  return { accessToken: data.access_token, refreshToken: data.refresh_token };

  } catch(e) {
    console.log('error when attempting to authenticate twitch user: ', (e.response && e.response.data) || e.message);
    return {};
  }
}

const attemptToRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return { authenticatedTwitchUser: null };
  }

  try {
    const refreshTokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, { params: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.HISTORY_TRACKER_CLIENT_ID,
      client_secret: process.env.HISTORY_TRACKER_API_SECRET
    }});
    
    const refreshTokenResponseData = refreshTokenResponse.data;

    const { authenticatedTwitchUser } = await verifyBroadcaster(refreshTokenResponseData.access_token, refreshTokenResponseData.refresh_token);

    return { authenticatedTwitchUser, newTokens: { accessToken: refreshTokenResponseData.access_token, refreshToken: refreshTokenResponseData.refresh_token } }
  } catch (e) {
    console.log('error when attempting to refresh token: ', (e.response && e.response.data) || e.message);
    return { authenticatedTwitchUser: null }
  }

}

const trimBearerPrefixIfExists = (accessCode) => accessCode && accessCode.startsWith(bearerPrefix) ? accessCode.substring(bearerPrefix.length) : accessCode

const updateRecordInDb = (dbParams) => {
    return new Promise((resolve, reject) => {
        const docClient = getDynamoDbDocClient();
    
        docClient.put(dbParams, (err, data) => {
            if (err) {
                reject();
            } else {
                resolve();
            }
        });
    })
}

module.exports = {
    getDynamoDbDocClient,
    verifyAndDecode,
    getFormattedResponse,
    broadcastToApplication,
    verifyBroadcaster,
    verifyBroadcasterWithRefresh,
    updateRecordInDb,
    authenticateTwitchUser
}