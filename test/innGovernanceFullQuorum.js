const { assert, expect } = require("chai");
const { Writable } = require("stream");
const InnGovernor = artifacts.require("InnGovernor");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("GovernanceFullQuorum", (accounts) =>  {

    let FirstValidator = accounts[9];
    let ADMIN_ROLE_SIGNER = accounts[0];
    let CONTRACT_ADDRESS ; 
    let innGovernance ;
    const ProposeNewValidator = 1 ;
    const ProposeNewStartUp = 2 ;
    const ProposeGrantRole = 3 ; 



    const proposalPending = 1 ; 
    const proposalActive = 2 ; 
    const proposalSucceeded = 5 ; 
    const proposalDefeated = 4 ; 
    const proposalExecuted = 8 ; 
    const proposalCanceled = 3; 
    
    const PROPOSE_NEW_VALIDATOR_DESC = "ADDING NEW VALIDATOR"; 

 let TxObj; 
    before(async () => {
      innGovernance = await InnGovernor.deployed();//new deployed at 

      CONTRACT_ADDRESS = innGovernance.address;
    });
     
    it("should only Validator propose new validator" , async ()=>{
      //given 

      //when 
      
       TxObj = await innGovernance.propose( PROPOSE_NEW_VALIDATOR_DESC , 
                                            web3.utils.asciiToHex('') ,
                                            accounts[8] ,
                                            0 , 
                                            0 , 
                                            ProposeNewValidator
                                            ,{from:accounts[9] } 
      );
        console.log("MAYBE TimeStamp " ,TxObj.logs[0].args[6].toString());
      //then 

      let ProposalHash = 
        web3.utils.keccak256(
          web3.eth.abi.encodeParameters(
            [
              'bytes32','bytes32','address','address','uint32','uint8','uint8'
            ],
            [
              web3.utils.keccak256(PROPOSE_NEW_VALIDATOR_DESC) , 
              web3.utils.asciiToHex('') ,
              accounts[9],
              accounts[8],
              0,
              0,
              ProposeNewValidator
            ]
          )
        );
            
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("DD" , ProposalHash);
        console.log("DDD" ,  web3.utils.toHex( TxObj.logs[0].args[0] ) );
        // assert.equal(new web3.utils.BN(ProposalHash) ,TxObj.logs[0].args[0] );


    // await web3.eth.sendTransaction({from:accounts[0] ,to:accounts[1], value:1000000});
      

    // const validatorCnt = await innGovernance.validatorCnt(); 
    // console.log(validatorCnt);

    });
    it("sdfsdf" , async ()=>{
        let state = await innGovernance.state(TxObj.logs[0].args[0]);
        // while(state == )
        let block = await web3.eth.getBlock("latest");
        console.log("TIMESTAMP : " , block.timestamp);
        let proposalState = await innGovernance.state(TxObj.logs[0].args[0]);
        console.log("PROPOSAL STATE : ",proposalState.toString());
        assert.equal(proposalState.toString(),"2");

    });

});
        