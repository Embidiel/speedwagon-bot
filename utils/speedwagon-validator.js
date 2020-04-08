const {Observable} = require('rxjs');
const COMMANDERS = require('../reference/valid-commanders');
exports.isValidCommander = (userId) => {
  return COMMANDERS[userId] ? true : false;
};
