const axios = require('axios');
const jwt = require("jsonwebtoken");

const { winTrackerSecret, winTrackerClientId, historyTrackerSecret, historyTrackerClientId } = require("./secrets");
const bearerPrefix = "Bearer ";
const serverTokenDurationSec = 30;

function verifyAndDecode(header) {
    if (header.startsWith(bearerPrefix)) {
        try {
            const token = header.substring(bearerPrefix.length);
            return jwt.verify(token, secret, { algorithms: ["HS256"] });
        } catch (e) {

        }
    }
}

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

  async function makeBroadcast(channelId, message) {
    await broadcastToApplication(winTrackerClientId, winTrackerSecret, channelId, message);
    await broadcastToApplication(historyTrackerClientId, historyTrackerSecret, channelId, message);
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

      console.log(`broadcast to ${clientId} successful: ${response.status}`);
    } catch(e) {
        console.log('broadcast failed: ', e.message);
    }
  }

  module.exports = {
    makeBroadcast
  }