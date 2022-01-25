const InnGovernor = artifacts.require("InnGovernor");

module.exports = function (deployer , network , accounts) {
  deployer.deploy(InnGovernor , accounts[9] );
};
