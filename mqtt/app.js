'use strict';

const mosca = require('mosca');
const http = require('http');
const WBMServer = require('./wbmServer.js');

let ascoltatore = {
  type: 'redis',
  redis: require('redis'),
  port: 6379,
  host: 'localhost',
  return_buffers: true
};

let settings = {
  backend: ascoltatore,
//  logger: { name: 'MoscaServer', level: 'debug' },
  persistence: {
    factory: mosca.persistence.Redis
  }
};

let httpServer = http.createServer();
let server = new WBMServer(settings);

httpServer.listen(3000, '127.0.0.1');
server.attachHttpServer(httpServer);

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});



server.on('published', function(packet, client) {
  console.log('publish method');
  console.dir(packet);
});

server.on('ready', () => {

  // TODO: authorize publishing
  //  server.authorizePublish = authorizePublish;

  console.log('Server is running!');
});
