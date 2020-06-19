const github = require('../lib/github');

module.exports = function () {
  console.log("Logging you into GitHub...");
  github.getOauth();
  // github.createRepo();
};
