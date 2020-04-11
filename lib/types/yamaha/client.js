/** @typedef {import("../../interfaces").Client} Client */
/** @typedef {import("../../interfaces").State} State */

const { KEYS } = require("../constants");

/**
 * @param {*} avrClient
 * @param {State} state
 * @returns {Client}
 */
exports.create = (avrClient, state) => {
  return {
    setPower(on) {
      return Promise.resolve()
        .then(() => {
          if (on) return avrClient.powerOn(1);
          else return avrClient.powerOff(1);
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
      if (typeof dbLevel !== "number")
        return Promise.reject(new Error("Number required"));

      const value = 10 * dbLevel;
      return avrClient.setVolumeTo(value, 1).then(() => {
        state.set(KEYS.VOLUME, dbLevel);
      });
    },
    adjustVolume(dbs) {
      if (typeof dbs !== "number") return;

      const value = 10 * dbs;

      return Promise.resolve()
        .then(() => {
          if (value < 0) {
            return avrClient.volumeDown(Math.abs(value), 1);
          }

          return avrClient.volumeUp(value, 1);
        })
        .then(() => {
          const current = state.get(KEYS.VOLUME);
          state.set(KEYS.VOLUME, current + dbs);
        });
    },
    mute() {
      return avrClient.muteOn(1).then(() => {
        state.set(KEYS.MUTE, true);
      });
    },
    unmute() {
      return avrClient.muteOff(1).then(() => {
        state.set(KEYS.MUTE, false);
      });
    },
    toggleMute() {
      const current = state.get(KEYS.MUTE);
      return this.setMute(!current);
    },
    setMute(mute) {
      if (mute) return this.mute();
      return this.unmute();
    },
    setInput(input) {
      return avrClient.setInputTo(input, 1).then(() => {
        state.set(KEYS.INPUT, input);
      });
    }
  };
};
