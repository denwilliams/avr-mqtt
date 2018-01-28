const VSX = require('./avr-client').VSX;

const deviceClient = require('./client');
const deviceMonitor = require('./monitor');
const deviceState = require('../state');

exports.create = (host) => {
  const state = deviceState.create();
  const avrClient = new VSX({
    // log: true,
    host,
    port: 23, // note: this can sometimes become unresponsive. could potentially switch to port 8102.
  });

  avrClient.on('connect', () => {
    console.log('Pioneer receiver connected');
  });

  const client = deviceClient.create(avrClient, state);
  const monitor = deviceMonitor.monitor(avrClient, state);

  return {
    monitor,
    state,
    client
  };
};
