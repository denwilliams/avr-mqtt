const { KEYS } = require('../constants');

exports.create = (avrClient, state) => {
  return {
    setPower(on) {
      return avrClient.connect()
      .then(() => {
        avrClient.power(on);
      })
      .then(() => {
        state.set(KEYS.POWER, on);
      });
    },
    togglePower() {
      const current = state.get(KEYS.POWER);
      return this.setPower(!current);
    },
    setVolume(dbLevel) {
      if (typeof dbLevel !== 'number') return Promise.reject(new Error('Number required'));

      return avrClient.connect()
      .then(() => {
        avrClient.volume(dbLevel);
      })
      .then(() => {
        state.set(KEYS.VOLUME, dbLevel);
      });
    },
    adjustVolume(dbs) {
      if (typeof dbs !== 'number') return;

      const value = state.get(KEYS.VOLUME) + dbs;

      return avrClient.connect()
      .then(() => {
        avrClient.volume(value);
      })
      .then(() => {
        state.set(KEYS.VOLUME, value);
      });
    },
    mute() {
      return this.setMute(true);
    },
    unmute() {
      return this.setMute(false);
    },
    toggleMute() {
      const current = state.get(KEYS.MUTE);
      return this.setMute(!current);
    },
    setMute(mute) {
      return avrClient.connect()
      .then(() => {
        avrClient.mute(mute);
      })
      .then(() => {
        state.set(KEYS.MUTE, mute);
      });
    },
    setInput(input) {
      return avrClient.connect()
      .then(() => {
        avrClient.selectInput(input);
      })
      .then(() => {
        state.set(KEYS.INPUT, input);
      });
    }
  }
};
