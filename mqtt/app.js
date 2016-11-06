'use strict';

const mosca = require('mosca');

let ascoltatore = {
  type: 'redis',
  redis: require('redis'),
  port: 6379,
  host: 'localhost',
  return_buffers: true
};

let settings = {
  port: 1883,
  backend: ascoltatore,
  logger: { name: 'MoscaServer', level: 'debug' },
  persistence: {
    factory: mosca.persistence.Redis
  }
};

let server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

server.on('published', function(packet, client) {
  console.log('publish method');
  console.dir(packet);
});

server.on('ready', () => {
  console.log('Server is running!');
});
