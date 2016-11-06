'use strict';

const mosca = require('mosca');

// Extend teh Mosca Server
let WBMServer = function (settings) { mosca.Server.call(this, settings) };

WBMServer.prototype = Object.create(mosca.Server.prototype);

WBMServer.prototype.constructor = WBMServer;

let messageToJson = (payload) => {
  let obj = {};
  let jsonString = payload.toString();

  try {
    obj = JSON.parse(payload);
    if (typeof obj === 'string') {
      obj = {
        m: obj
      };
    }
  } catch (e) {
    obj = JSON.parse('{' + jsonString + '}');
  }

  return obj;

}

let injectTimestamp = (payload) => {
 
  payload.w = new Date().getTime();
  return payload;
}



WBMServer.prototype.publish = function(packet, client, callback) {
  if (packet.topic.indexOf('$SYS') !== 0) 
    packet.payload = new Buffer(
        JSON.stringify(
          injectTimestamp( messageToJson(packet.payload) )
        )

        // remove top and tail brackets
        .replace(/^\{|\}$/g, '')
      );
  console.dir(packet);
  return mosca.Server.prototype.publish.call(this, packet, client, callback);
}




module.exports = WBMServer;
