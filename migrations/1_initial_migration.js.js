const InnToken = artifacts.require("InnToken");


const InnGovernor = artifacts.require("InnGovernor");
module.exports = async function (deployer , network , accounts) {
  // deploy a contract
  await deployer.deploy(InnToken , accounts[9] , accounts[0] );
  //access information about your deployed contract instance
  // const innToken = await InnToken.deployed();
  await deployer.deploy(InnGovernor , accounts[9] , 0,1 );
  // const innGovernor = await InnGovernor.deployed();

}



// module.exports = function (deployer , network , accounts) {

//   deployer.deploy(InnToken , accounts[9] , accounts[0] ).then( function(){
//     tokenAddress = InnToken.address; 
//     // return deployer.deploy(InnGovernor , accounts[9] , 0,1 );
//     console.log(tokenAddress);

//   });
  

// };
