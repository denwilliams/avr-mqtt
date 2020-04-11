/** @typedef {import("../interfaces").Instance} Instance */

/**
 * @type {{[key: string]: (params: any) => Instance}}
 */
module.exports = exports = {
  pioneer: require("./pioneer"),
  yamaha: require("./yamaha")
};
