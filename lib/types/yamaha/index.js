/** @typedef {import("../../interfaces").Instance} Instance */

const deviceFactory = require("./device");

/**
 * @type {{[key: string]: (params: any) => Instance}}
 */
module.exports = params => {
  const { host } = params;
  return deviceFactory.create(host);
};
