const { default: Web3 } = require("web3");

const InnToken = artifacts.require("InnToken");


const InnGovernor = artifacts.require("InnGovernor");
module.exports = async function (deployer , network , accounts) {
  // deploy a contract
  let RESERVED_WALLET = accounts[9] ; 
  let COMMISION_WALLET = accounts[1];
  let START_VALIDATOR = accounts[8];
  await deployer.deploy(InnToken , RESERVED_WALLET ,COMMISION_WALLET );
  //access information about your deployed contract instance
  const innTokenInst = await InnToken.deployed();
  const innTokenAddress = innTokenInst.address ; 
  await deployer.deploy(InnGovernor ,innTokenAddress , START_VALIDATOR,RESERVED_WALLET ,COMMISION_WALLET , 0,3600 , {from:accounts[0] , value: "1000000000000000000"} );
  
  const innGovernorInst = await InnGovernor.deployed();
  innGovernanceAddress = innGovernorInst.address ;

  const CONSENSUS_ROLE = web3.utils.keccak256("CONSENSUS_ROLE");
  const DEFAULT_ADMIN_ROLE = 0x00;

  //innGovernance address must have consensuse role 
  innTokenInst.grantRole(CONSENSUS_ROLE , innGovernanceAddress);

  //NEW CHANGE : CONSENSUS_ROLE GOING TO BE ADMIN ROLE IN INNTOKEN . 
  //THE OWNER OF GOVERNANCE WILL HAVE PERMISSIONS TO EXECUTE FREEZE FROM GOVERNANCE CONTRACT 
  innTokenInst.grantRole(DEFAULT_ADMIN_ROLE , innGovernanceAddress);

  innTokenInst.renounceRole(DEFAULT_ADMIN_ROLE , accounts[0]);

  //in the next step the innGovernanceAddress have to has allowance to transfer from 
  innTokenInst.approve(innGovernanceAddress , new web3.utils.BN(1996760000).mul(new web3.utils.BN("10").pow(new web3.utils.BN("7"))) ,
                      {from : RESERVED_WALLET} );

}



// module.exports = function (deployer , networkyarn , accounts) {

//   deployer.deploy(InnToken , accounts[9] , accounts[0] ).then( function(){
//     tokenAddress = InnToken.address; 
//     // return deployer.deploy(InnGovernor , accounts[9] , 0,1 );
//     console.log(tokenAddress);

//   });
  

// };
