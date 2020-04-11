const { EventEmitter } = require("events");
const { KEYS, MODES } = require("./constants");

/**
 * @returns {import("../interfaces").State}
 */
exports.create = () => {
  const state = new Map();
  const emitter = new EventEmitter();

  state.set(KEYS.VOLUME, -1000);

  return {
    get(key) {
      return state.get(key);
    },
    set(key, value) {
      const current = state.get(key);
      if (current === value) return false;

      state.set(key, value);

      emitter.emit("update", { key, value });
    },
    addListener: emitter.addListener.bind(emitter),
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter)
  };
};
