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
contract("GovernanceFullQuorum", (accounts) =>  {

    let FirstValidator = accounts[9];
    let ADMIN_ROLE_SIGNER = accounts[0];
    let CONTRACT_ADDRESS ; 
    let innGovernance ;
    let innToken ; 
    const ProposeNewValidator = 1 ;
    const ProposeNewStartUp = 2 ;
    const ProposeGrantRole = 3 ; 



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
            
        
        assert.equal(ProposalHash ,web3.utils.toHex( TxObj.logs[0].args[0] )  );
        
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
        console.log(validatorCnt.toString());
      //when 
        await innGovernance.execute(lastProposalId, {from : ADMIN_ROLE_SIGNER});
      //then 
      let validatorCntPrime =  await innGovernance.validatorCnt();
      console.log(validatorCntPrime.toString());
      assert.equal(validatorCntPrime.toString() , validatorCnt.add(new web3.utils.BN("1")).toString()); 
      assert.equal(innGovernance._isValidator(accounts[7]), true);
      
    });

    it("should new validator propose new start up " , async() =>{
      let TxObj = await innGovernance.propose( PROPOSE_NEW_STARTUP_DESC , 
        web3.utils.asciiToHex('') ,
        accounts[8] ,
        accounts[1] , 
        20000 , 
        ProposeNewStartUp
        ,{from:accounts[9] } 
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
            web3.utils.asciiToHex('1') ,
            accounts[9],
            FIRST_STARTUP,
            20000,
            10,
            ProposeNewStartUp
          ]
        )
      );
      assert.equal(ProposalHash ,web3.utils.toHex( TxObj.logs[0].args[0] )  );
        
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

      //given 
        let proposalState = await innGovernance.state(lastProposalId);
    
    
      //when 
        await innGovernance.execute(lastProposalId, {from : ADMIN_ROLE_SIGNER});
      //then 
        
      
      

    });


    
});
        