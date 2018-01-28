const Yamaha = require('yamaha-nodejs');

const deviceClient = require('./client');
const deviceMonitor = require('./monitor');
const deviceState = require('../state');

exports.create = (host) => {
  const state = deviceState.create();
  const avrClient = new Yamaha(host);
  const client = deviceClient.create(avrClient, state);
  const monitor = deviceMonitor.monitor(avrClient, state);

  return {
    monitor,
    state,
    client
  };
};
