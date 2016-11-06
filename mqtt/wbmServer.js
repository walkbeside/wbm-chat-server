'use strict';

const mosca = require('mosca');

// Extend teh Mosca Server
let WBMServer = function (settings) { mosca.Server.call(this, settings) };

WBMServer.prototype = Object.create(mosca.Server.prototype);

WBMServer.prototype.constructor = WBMServer;

let messageToJson = (payload) => {
  let obj = {};
  
  // In case the payload is a buffer
  let jsonString = payload.toString();

  try {
    obj = JSON.parse(jsonString);
  } catch (e) {
    // TODO: Log an error if the message is not a JOSN object
    console.error(e);
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

      );
  console.dir(packet);
  return mosca.Server.prototype.publish.call(this, packet, client, callback);
}




module.exports = WBMServer;
