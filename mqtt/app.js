'use strict';

const mosca = require('mosca');
const WBMServer = require('./wbmServer.js');

let chats = [];

let ascoltatore = {
  type: 'redis',
  redis: require('redis'),
  port: 6379,
  host: 'localhost',
  return_buffers: true
};

let settings = {
  http: {
    port: 3000,
    bundle: true,
    static: './'
  },
  backend: ascoltatore,
//  logger: { name: 'MoscaServer', level: 'debug' },
  persistence: {
    factory: mosca.persistence.Redis
  }
};

let server = new WBMServer(settings);

server.on('clientConnected', function(client) {
  chats.push('m/' + client.id);
  console.log('client connected', client.id);
});

server.on('published', function(packet, client) {
  console.log('publish method');
  console.dir(packet);
});

let authorizePublish = (client, topic, payload, callback) => {
  console.log(topic, client.id, topic === 'm/' + client.id);


  callback(null, topic === 'm/' + client.id);
}

server.on('ready', () => {

  server.authorizePublush = authorizePublish;

  console.log('Server is running!');
});
