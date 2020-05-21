#!/usr/bin/env node
const mqttusvc = require("mqtt-usvc");

const types = require("./types");
const { KEYS } = require("./types/constants");

/** @typedef {import("./interfaces").Client} Client */
/** @typedef {import("./interfaces").Instance} Instance */
/** @typedef {import("./interfaces").ServiceConfig} ServiceConfig */

async function main() {
  /** @type {import("mqtt-usvc").Service<ServiceConfig>} */
  const service = await mqttusvc.create();

  const { devices } = service.config;

  const instances = devices.reduce((obj, device) => {
    const { id, name, type, params } = device;
    const typeFactory = types[type];

    /** @type {Instance} */
    const instance = typeFactory(params);

    /**
     * @param {string} key
     * @param {*} value
     */
    const emit = (key, value) => {
      service.send(`~/${device.id}/${key}`, value);
    };

    instance.state.on("update", ({ key, value }) => {
      emit(key, value);
    });

    obj[id] = instance;
    return obj;
  }, /** @type {{[id: string]: Instance}} */ ({}));

  service.on("message", (topic, data) => {
    const { deviceId, key, value, action } = data;
    const instance = instances[deviceId];
    if (!instance) return;

    switch (key) {
      case KEYS.VOLUME:
        if (action === "set") instance.client.setVolume(value);
        else if (action === "adjust") instance.client.adjustVolume(value);
        return;
      case KEYS.POWER:
        if (action === "set") instance.client.setPower(value);
        else if (action === "toggle") instance.client.togglePower();
        return;
      case KEYS.INPUT:
        if (action === "set") instance.client.setInput(value);
        return;
      case KEYS.MUTE:
        if (action === "set") instance.client.setMute(value);
        if (action === "toggle") instance.client.toggleMute();
        return;
    }
  });

  service.subscribe("~/set/#");
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
