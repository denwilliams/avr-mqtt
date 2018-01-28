const { KEYS, MODES } = require('../constants');

const HIGH_INTERVAL_DURATION = 3000;
const LOW_INTERVAL_DURATION = 30000;
const MODE_SWITCH_COUNT = 20;

exports.monitor = (avrClient, state) => {
  let interval;
  let currentMode = MODES.LOW;
  let noChangesCounter = 0;

  state.on('update', () => {
    noChangesCounter = 0;
    if (currentMode === MODES.HIGH) return;
    switchMode(MODES.HIGH);
  });

  function switchMode(mode) {
    // console.log('SWITCHING MODE TO', mode);
    switch (mode) {
      case MODES.HIGH:
        clearInterval(interval);
        interval = setInterval(refresh, HIGH_INTERVAL_DURATION);
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
    return avrClient.getBasicInfo(1)
    .then(basicInfo => {
      if (currentMode === MODES.HIGH) noChangesCounter++;

      state.set(KEYS.VOLUME, basicInfo.getVolume() / 10);
      state.set(KEYS.MUTE, basicInfo.isMuted());
      state.set(KEYS.POWER, basicInfo.isOn());
      state.set(KEYS.INPUT, basicInfo.getCurrentInput());
      // basicInfo.isPartyModeEnabled();
      // basicInfo.isPureDirectEnabled();

      if (noChangesCounter > MODE_SWITCH_COUNT) {
        noChangesCounter = 0;
        switchMode(MODES.LOW);
      }
    })
    .catch(err => console.error('ERROR', err))
    .done(() => {});
  }

  switchMode(MODES.HIGH);

  return {
    close() {
      clearInterval(interval);
    }
  };
};
