const InnToken = artifacts.require("InnToken");


const InnGovernor = artifacts.require("InnGovernor");
module.exports = async function (deployer , network , accounts) {
  // deploy a contract
  let RESERVED_WALLET = accounts[9] ; 
  let COMMISION_WALLET = accounts[0];
  let START_VALIDATOR = accounts[8];
  await deployer.deploy(InnToken , RESERVED_WALLET ,COMMISION_WALLET );
  //access information about your deployed contract instance
  const innTokenInst = await InnToken.deployed();
  const innTokenAddress = innTokenInst.address ; 
  await deployer.deploy(InnGovernor ,innTokenAddress , START_VALIDATOR , 0,3600 );
  // const innGovernor = await InnGovernor.deployed();

}



// module.exports = function (deployer , network , accounts) {

//   deployer.deploy(InnToken , accounts[9] , accounts[0] ).then( function(){
//     tokenAddress = InnToken.address; 
//     // return deployer.deploy(InnGovernor , accounts[9] , 0,1 );
//     console.log(tokenAddress);

//   });
  

// };
