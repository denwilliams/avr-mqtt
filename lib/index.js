const config = require('./config');
const types = require('./types');
const mqtt = require('./mqtt');
const { KEYS } = require('./types/constants');

mqtt.start();

const devices = config.get('devices');
const instances = {};

devices.forEach(d => {
  const { id, name, type, params } = d;
  const typeFactory = types[type];
  const instance = typeFactory(params);

  function emit(key, value) {
    mqtt.emit(d, key, value);
  }

  instance.state.on('update', ({ key, value }) => {
    emit(key, value);
  });

  instances[id] = instance;
});

mqtt.on('message', (data) => {
  console.log('message', data);
  const { deviceId, key, value, action } = data;
  const instance = instances[deviceId];
  if (!instance) return;

  if (key === KEYS.VOLUME) {
    if (action === 'set') instance.client.setVolume(value);
    else if (action === 'adjust') instance.client.adjustVolume(value);
    return;
  }

  if (key === KEYS.POWER) {
    if (action === 'set') instance.client.setPower(value);
    else if (action === 'toggle') instance.client.togglePower();
    return;
  }

  if (key === KEYS.POWER) {
    if (action === 'set') instance.client.setPower(value);
    else if (action === 'toggle') instance.client.togglePower();
    return;
  }

  if (key === KEYS.INPUT) {
    if (action === 'set') instance.client.setInput(value);
    return;
  }

  if (key === KEYS.MUTE) {
    if (action === 'set') instance.client.setMute(value);
    if (action === 'toggle') instance.client.toggleMute();
    return;
  }
});

exports.instances = instances;
