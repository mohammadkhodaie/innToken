const { assert, expect } = require("chai");
const { Writable } = require("stream");
const InnToken = artifacts.require("InnToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ERC20", (accounts) =>  {
    const CONSENSUS_ROLE = web3.utils.keccak256("CONSENSUS_ROLE");
    const DEFAULT_ADMIN_ROLE = 0x00;
    let CONSENSUS_ROLE_SIGNER = accounts[9];
    let ADMIN_ROLE_SIGNER = accounts[0];
    let CONTRACT_ADDRESS ; 
    let innToken ;
    before(async () => {
        innToken = await InnToken.deployed();//new deployed at 
        await innToken.grantRole(CONSENSUS_ROLE ,CONSENSUS_ROLE_SIGNER , {
          from:accounts[0],
    });
    await innToken.transfer( accounts[5] ,  10000 , {
        from:CONSENSUS_ROLE_SIGNER,
      });
      CONTRACT_ADDRESS = innToken.address;
    });
      

});
        