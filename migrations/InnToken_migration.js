const InnToken = artifacts.require("InnToken");

module.exports = function (deployer , network , accounts) {
  deployer.deploy(InnToken , accounts[9] , accounts[0] );
};
