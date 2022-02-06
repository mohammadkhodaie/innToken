const { assert, expect } = require("chai");
const { Writable } = require("stream");
// const InnToken = artifacts.require("InnToken");
// const Governance = artifacts.require("Governance");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

contract("Governance" , (accounts) => {
    const RESERVE_WALLET_ALLOWANCE = accounts[9];
    let ADMIN_ROLE_SIGNER = accounts[0];
    let CONTRACT_ADDRESS ; 
    let governance ; 
    before(async () => {
        governance = await Governance.deployed();//new deployed at 
    //   await innToken.grantRole(CONSENSUS_ROLE ,CONSENSUS_ROLE_SIGNER , {
    //     from:accounts[0],
        CONTRACT_ADDRESS = governance.address ;
    });
    it("should any validator propose new validator >> Quorum_Bofore_Ending_Time" , async ()=>{});

    it("should any validator cast vote on new validator voting >> Quorum_Bofore_Ending_Time " , async ()=>{  });
    it("should get the true state of proposal >> Quorum_Bofore_Ending_Time" , async ()=>{  });
    it("should only ADMIN role execute the proposal after Quorum_Reached >> Quorum_Bofore_Ending_Time",async ()=>{  });
    it("should new validator added to existence validators with isValidator function >> Quorum_Bofore_Ending_Time" , async ()=>{  });
    it("should get the true state of proposal >> Quorum_Bofore_Ending_Time" , async ()=>{  });


    it("should any validator propose new validator >> Quorum_After_Ending_Time" , async ()=>{});

    it("should any validator cast vote on new validator voting >> Quorum_After_Ending_Time " , async ()=>{  });
    it("should get the true state of proposal >> Quorum_After_Ending_Time" , async ()=>{  });
    it("should only ADMIN role execute the proposal after Quorum_Reached >> Quorum_After_Ending_Time",async ()=>{  });
    it("should new validator added to existence validators with isValidator function >> Quorum_After_Ending_Time" , async ()=>{  });
    it("should get the true state of proposal >> Quorum_After_Ending_Time" , async ()=>{  });

    it("should  ")

});