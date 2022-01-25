const { assert, expect } = require("chai");
const { Writable } = require("stream");
const InnToken = artifacts.require("InnGovernor");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Governance", (accounts) =>  {

    let FirstValidator = accounts[9];
    let ADMIN_ROLE_SIGNER = accounts[0];
    let CONTRACT_ADDRESS ; 
    let innGovernance ;
    before(async () => {
      innGovernance = await InnGovernor.deployed();//new deployed at 

      CONTRACT_ADDRESS = innToken.address;
    });
     
    it("should only Validator propose new validator >> QUOR")

});
        