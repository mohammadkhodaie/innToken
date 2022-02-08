const { assert, expect, should } = require("chai");
const { allowedNodeEnvironmentFlags } = require("process");
const { Writable } = require("stream");
const InnGovernor = artifacts.require("InnGovernor");
const InnToken = artifacts.require("InnToken");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

// function waitFunc(){
//   await web3.eth.sendTransaction({from:accounts[0] ,to:accounts[1], value:1000000});
//   await new Promise(resolve => setTimeout(resolve, 3000));
//   await web3.eth.sendTransaction({from:accounts[1] ,to:accounts[0], value:1000000});
// }
contract("GovernanceFullQuorum", (accounts) =>  {

    let FirstValidator = accounts[9];
    let ADMIN_ROLE_SIGNER = accounts[0];
    let CONTRACT_ADDRESS ; 
    let innGovernance ;
    let innToken ; 
    const ProposeNewValidator = 1 ;
    const ProposeNewStartUp = 2 ;
    const ProposeGrantRole = 3 ; 

    let RESERVED_WALLET = accounts[9] ; 
    let COMMISION_WALLET = accounts[1];
    let START_VALIDATOR = accounts[8];

    const proposalPending   = "1" ; 
    const proposalActive    = "2" ; 
    const proposalSucceeded = "5" ; 
    const proposalDefeated  = "4" ; 
    const proposalExecuted  = "8" ; 
    const proposalCanceled  = "3" ; 
    
    const PROPOSE_NEW_VALIDATOR_DESC = "ADDING NEW VALIDATOR"; 
    const PROPOSE_NEW_STARTUP_DESC = "ADDING NEW STARTUP"; 

    const FIRST_STARTUP = accounts[5];

    let lastProposalId; 
    before(async () => {
      innGovernance = await InnGovernor.deployed();//new deployed at 
      innToken = await InnToken.deployed();
      CONTRACT_ADDRESS = innGovernance.address;
    }); 

    it("should only Validator propose new validator" , async ()=>{
      //given 

      //when 
      
       let TxObj = await innGovernance.propose( PROPOSE_NEW_VALIDATOR_DESC , 
                                            web3.utils.asciiToHex('') ,
                                            accounts[7] ,
                                            0 , 
                                            0 , 
                                            ProposeNewValidator
                                            ,{from:accounts[8] } 
      );

      lastProposalId = TxObj.logs[0].args[0];
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
              accounts[8],
              accounts[7],
              0,
              0,
              ProposeNewValidator
            ]
          )
        );
            
        
        assert.equal(new web3.utils.toBN(ProposalHash).toString() ,new web3.utils.toBN( TxObj.logs[0].args[0] ).toString()  );
        
        await web3.eth.sendTransaction({from:accounts[0] ,to:accounts[1], value:1000000});
        await new Promise(resolve => setTimeout(resolve, 3000));
        await web3.eth.sendTransaction({from:accounts[1] ,to:accounts[0], value:1000000});

        let proposalState = await innGovernance.state(lastProposalId);
        assert.equal(proposalState.toString(),proposalActive);


      

    });
    it("should validator vote on accept new validator" , async ()=>{
      //given 
        let proposalState = await innGovernance.state(lastProposalId);

      //when
        await innGovernance.castVote(lastProposalId ,2 , {from:accounts[8]} );
      //then 
        let proposalStatePrime = await innGovernance.state(lastProposalId);

      assert.equal(proposalStatePrime.toString(),proposalSucceeded);

    });
    it("should only Owner of contract execute the proposal after succeed", async() => {
      //given 
        let proposalState = await innGovernance.state(lastProposalId);
        let validatorCnt =  await innGovernance.validatorCnt();
        console.log("VALIDATOR_CNT  : " , validatorCnt.toString());
        console.log("PROPOSAL_STATE : " , proposalState.toString());
      //when 
        let success =  await innGovernance.execute(lastProposalId, {from : ADMIN_ROLE_SIGNER});
      //then 
      await web3.eth.sendTransaction({from:accounts[0] ,to:accounts[1], value:1000000});
      await new Promise(resolve => setTimeout(resolve, 3000));
      await web3.eth.sendTransaction({from:accounts[1] ,to:accounts[0], value:1000000});

        let validatorCntPrime =  await innGovernance.validatorCnt();
        console.log("VALIDATOR_CNT_PRIME : " , validatorCntPrime.toString());
        console.log("IS_VALIDATOR : " ,await innGovernance._isValidator(accounts[7]) );
        assert.equal(validatorCntPrime.toString() , validatorCnt.add(new web3.utils.BN("1")).toString()); 
        assert.equal(await innGovernance._isValidator(accounts[7]), true);
        
    });

    it("should new validator propose new start up " , async() =>{
      let TxObj = await innGovernance.propose( PROPOSE_NEW_STARTUP_DESC , 
        web3.utils.asciiToHex('') ,
        FIRST_STARTUP, 
        20000 , 
        10 , 
        ProposeNewStartUp
        ,{from:accounts[8] } 
      );

      lastProposalId = TxObj.logs[0].args[0];
      
      let ProposalHash = 
      web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          [
            'bytes32','bytes32','address','address','uint32','uint8','uint8'
          ],
          [
            web3.utils.keccak256(PROPOSE_NEW_STARTUP_DESC) , 
            web3.utils.asciiToHex('') ,
            accounts[8],
            FIRST_STARTUP,
            20000,
            10,
            ProposeNewStartUp
          ]
        )
      );
      assert.equal(new web3.utils.toBN(ProposalHash).toString() ,new web3.utils.toBN( lastProposalId ).toString()  );

        
      await web3.eth.sendTransaction({from:accounts[0] ,to:accounts[1], value:1000000});
      await new Promise(resolve => setTimeout(resolve, 3000));
      await web3.eth.sendTransaction({from:accounts[1] ,to:accounts[0], value:1000000});

      let proposalState = await innGovernance.state(lastProposalId);
      assert.equal(proposalState.toString(),proposalActive);
    
    });
    it("should validators vote on the proposal" , async ()=> {
      //given 
      let proposalState = await innGovernance.state(lastProposalId);

      //when
        await innGovernance.castVote(lastProposalId ,2 , {from:accounts[7]} );
        await innGovernance.castVote(lastProposalId ,2 , {from:accounts[8]} );

      //then 
        let proposalStatePrime = await innGovernance.state(lastProposalId);

        assert.equal(proposalStatePrime.toString(),proposalSucceeded);

    });

    it("should owner execute the proposal " , async ()=>{

      let allowant = await innToken.allowance(accounts[9], innGovernance.address);
      console.log("ALLOWANCE :: " , allowant.toString());

      //given 
        let proposalState = await innGovernance.state(lastProposalId);
        let startUpBalance = await innToken.balanceOf(FIRST_STARTUP);
        let commissionBalance = await innToken.balanceOf(COMMISION_WALLET);

        console.log("commissionBalance : " ,commissionBalance.toString() );
      //when 
        
        let tx = await innGovernance.execute(lastProposalId, {from : ADMIN_ROLE_SIGNER  , gasLimit: 20000000  });
        // console.log("TX",tx);

        // console.log("TX_RAWLOGS " ,tx.receipt.rawLogs);

        
        //then 
        let proposalStatePrime = await innGovernance.state(lastProposalId);

      //wait for build block   
        await web3.eth.sendTransaction({from:accounts[0] ,to:accounts[1], value:1000000});
        await new Promise(resolve => setTimeout(resolve, 3000));
        await web3.eth.sendTransaction({from:accounts[1] ,to:accounts[0], value:1000000});

      let startUpBalancePrime = await innToken.balanceOf(FIRST_STARTUP);
      let commissionBalancePrime = await innToken.balanceOf(COMMISION_WALLET);
      console.log("commissionBalancePrime :  ", commissionBalancePrime.toString());
      assert.equal(
        startUpBalancePrime.toString(),
        new web3.utils.BN(startUpBalance).add(new web3.utils.BN("20000")).toString()
      );
      //commision wallet get 5% of 20000 that must be equal 
      assert.equal(
        commissionBalancePrime.toString(),
        new web3.utils.BN(commissionBalance).add(new web3.utils.BN("1000")).toString()
      );
      

    });


    
});
        