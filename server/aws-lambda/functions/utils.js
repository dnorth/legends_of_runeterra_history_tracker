
const jwt = require("jsonwebtoken");
const AWS = require('aws-sdk');
const axios = require('axios');

const IS_PROD = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production';

const dynamoDBConfig = IS_PROD
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

const verifyBroadcaster = async (accessToken, refreshToken) => {
    const axiosInstance = axios.create({
        baseURL: 'https://api.twitch.tv/helix/users',
        headers: {
            'Authorization': accessToken,
            "Client-ID": process.env.HISTORY_TRACKER_CLIENT_ID
        }
    })

    try {
        const userInfoResponse = await axiosInstance.get();
        const authenticatedTwitchUser = userInfoResponse && userInfoResponse.data && userInfoResponse.data.data && userInfoResponse.data.data[0];

        return authenticatedTwitchUser; 
    } catch (e) {
        console.log('User Auth Error: ', e.response && e.response.data);
        //if response is bad, use refreshToken to attempt to get user again.
        return null;
    }
}

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
    updateRecordInDb
}