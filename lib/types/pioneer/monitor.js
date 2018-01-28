const { KEYS, MODES } = require('../constants');

const MODE_SWITCH_NO_ACTIVITY_DURATION = 30000;
const QUERY_DURATION = 300000;
const KEEPALIVE_INTERVAL_DURATION = 10000;

exports.monitor = (avrClient, state) => {
  let interval;
  let lowModeTimer;
  let currentMode = MODES.LOW;

  state.on('update', () => {
    if (currentMode === MODES.LOW) switchMode(MODES.HIGH);
    else resetTimeout();
  });

  avrClient.on('power', isOn => {
    state.set(KEYS.POWER, isOn);
  });
  avrClient.on('volume', db => {
    state.set(KEYS.VOLUME, db);
  });
  avrClient.on('mute', mute => {
    state.set(KEYS.MUTE, mute);
  });
  avrClient.on('input', (input, inputName) => {
    console.log('input', input, inputName);
    state.set(KEYS.INPUT, input);
  });

  function resetTimeout() {
    if (lowModeTimer) clearTimeout(lowModeTimer);

    lowModeTimer = setTimeout(() => {
      switchMode(MODES.LOW);
    }, MODE_SWITCH_NO_ACTIVITY_DURATION);
  }

  function switchMode(mode) {
    console.log('SWITCHING MODE TO', mode);
    switch (mode) {
      case MODES.HIGH:
        keepAliveInterval = setInterval(keepAlive, KEEPALIVE_INTERVAL_DURATION);
        break;
      case MODES.LOW:
        clearInterval(keepAliveInterval);
        break;
      default:
        break;
    }
    currentMode = mode;
  }

  // This interval will reconnect if required to refresh state
  refreshInterval = setInterval(() => refresh(), QUERY_DURATION);

  function refresh() {
    avrClient.connect()
    .then(() => avrClient.query());
  }

  function keepAlive() {
    avrClient.keepAlive();
  }

  switchMode(MODES.HIGH);

  avrClient.on('connect', () => {
    refresh();
  });

  return {
    close() {
      clearInterval(interval);
    }
  };
};
