const { KEYS, MODES } = require('../constants');

const MODE_SWITCH_NO_ACTIVITY_DURATION = 30000;
const LOW_INTERVAL_DURATION = 30000;

exports.monitor = (avrClient, state) => {
  let interval;
  let lowModeTimer;
  let currentMode = MODES.LOW;

  state.on('update', () => {
    if (currentMode === MODES.HIGH) switchMode(MODES.HIGH);
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
        break;
      case MODES.LOW:
        clearInterval(interval);
        interval = setInterval(refresh, LOW_INTERVAL_DURATION);
        break;
      default:
        break;
    }
    currentMode = mode;
  }

  function refresh() {
    avrClient.query();
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
