const axios = require('axios');
const jwt = require("jsonwebtoken");

const { winTrackerSecret, winTrackerClientId } = require("./secrets");
const bearerPrefix = "Bearer ";
const serverTokenDurationSec = 30;

var secret = Buffer.from(winTrackerSecret, 'base64');

function verifyAndDecode(header) {
    if (header.startsWith(bearerPrefix)) {
        try {
            const token = header.substring(bearerPrefix.length);
            return jwt.verify(token, secret, { algorithms: ["HS256"] });
        } catch (e) {

        }
    }
}

function makeServerBroadcastToken(channelId) {
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

  async function makeBroadcast(channelId, message) {
      const headers = {
          "Client-Id": winTrackerClientId,
          "Content-Type": "application/json",
          Authorization: bearerPrefix + makeServerBroadcastToken(channelId)
      };

      const body = JSON.stringify({
        content_type: 'application/json',
        message,
        targets: [ 'broadcast' ]
      });

      try {
        const response = await axios.post(`https://api.twitch.tv/extensions/message/${channelId}`, body, { headers });

        console.log('response: ', response.status);
      } catch(e) {
          console.log('error: ', e)
      }
  }

  module.exports = {
    makeBroadcast
  }