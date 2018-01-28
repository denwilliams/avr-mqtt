const deviceFactory = require('./device');
// const logger = require('../../logger');

module.exports = (params) => {
  const { host } = params;
  return deviceFactory.create(host);
};
