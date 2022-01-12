
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

  it("should any one transfer token from itself account", async function () {
    //given
      const fromBalance = await innToken.balanceOf(accounts[5]);
      const toBalance = await innToken.balanceOf(accounts[6]);
    //when 
      await innToken.transfer(accounts[6] , 1000 , {
        from :accounts[5], 
      });
    //then 
    let fromBalancePrim = await innToken.balanceOf(accounts[5]);
    let toBalancePrim = await innToken.balanceOf(accounts[6]);
    assert.equal(
      fromBalancePrim.toString(),
      new web3.utils.BN(fromBalance).sub(new web3.utils.BN("1000")).toString()
    );
    assert.equal(
      toBalancePrim.toString(),
      new web3.utils.BN(toBalance).add(new web3.utils.BN("1000")).toString()
    );
  });

  it("should only DEFAULT_ADMIN_ROLE mint toke" , async ()=>{
    //given 
      const totalSupply = await innToken.totalSupply();
      const toBalance = await innToken.balanceOf(accounts[5]);
    //when 
      await innToken.mint(accounts[5] , 1_000_000 , {
        from:accounts[0],
      });
    //then 
      const toBalancePrim =  await innToken.balanceOf(accounts[5]);
      const totalSupplyPrim = await innToken.totalSupply();

      assert.equal(
        toBalancePrim.toString(),
        new web3.utils.BN(toBalance).add(new web3.utils.BN("1000000")).toString()
      );
      assert.equal(
        totalSupplyPrim.toString(),
        new web3.utils.BN(totalSupply).add(new web3.utils.BN("1000000")).toString()
      );

  });
    
  it("should not mint token any role expect DEFAULT_ADMIN_ROLE" , async ()=>{
    //given 
      const totalSupply = await innToken.totalSupply();
      const toBalance = await innToken.balanceOf(accounts[5]);
    //when
      try {
        await innToken.mint(accounts[5] , 1_000_000 , {
          from:accounts[6],
        }); 
      } catch (error) {}
    //then 
    const toBalancePrim =  await innToken.balanceOf(accounts[5]);
    const totalSupplyPrim = await innToken.totalSupply();

    assert.equal(
      toBalancePrim.toString(),
      toBalance.toString()
    );
    assert.equal(
      totalSupplyPrim.toString(),
      totalSupply.toString()
    );

  });
  it("should CONSESUS_ROLE transfer token from RESERVES_WALLET_ADDRESS " , async()=>{
    //given
      const fromBalance = await innToken.balanceOf(CONSENSUS_ROLE_SIGNER);
      const toBalance = await innToken.balanceOf(accounts[5]);
    //when 
      await innToken.transfer(accounts[5] , 1000 , {
        from :CONSENSUS_ROLE_SIGNER, 
      });
    //then 
    let fromBalancePrim = await innToken.balanceOf(CONSENSUS_ROLE_SIGNER);
    let toBalancePrim = await innToken.balanceOf(accounts[5]);
    assert.equal(
      fromBalancePrim.toString(),
      new web3.utils.BN(fromBalance).sub(new web3.utils.BN("1000")).toString()
    );
    assert.equal(
      toBalancePrim.toString(),
      new web3.utils.BN(toBalance).add(new web3.utils.BN("1000")).toString()
    );
  });
  it("should not transferFrom RESERVES_WALLET_ADDRESS any role expect CONSESUS_ROLE" , async()=>{
    //given
      const fromBalance = await innToken.balanceOf(CONSENSUS_ROLE_SIGNER);
      const toBalance = await innToken.balanceOf(accounts[5]);
    //when 
    try{
      await innToken.transferFrom(CONSENSUS_ROLE_SIGNER , accounts[5],1000 , {
        from :ADMIN_ROLE_SIGNER, 
      });
    }catch(error){};
    //then 
    let fromBalancePrim = await innToken.balanceOf(CONSENSUS_ROLE_SIGNER);
    let toBalancePrim = await innToken.balanceOf(accounts[5]);
    assert.equal(
      fromBalance.toString(),
      fromBalancePrim.toString()
    );
    assert.equal(
      toBalance.toString(),
      toBalancePrim.toString()
    );
  });
  it("should only CONSENSUS_ROLE burn from RESERVES_WALLET_ADDRESS" , async()=>{
    //given
    const reserveBalance = await innToken.balanceOf(CONSENSUS_ROLE_SIGNER);
    //when
    await innToken.burn( 1000 , {
      from :CONSENSUS_ROLE_SIGNER, 
    });
    //then 
    const reserveBalancePrime = await innToken.balanceOf(CONSENSUS_ROLE_SIGNER);
    assert.equal(
      reserveBalancePrime.toString(),
      new web3.utils.BN(reserveBalance).sub(new web3.utils.BN("1000")).toString()
    );
  });
  it("should not any role expect CONSENSUS_ROLE burn from RESERVES_WALLET_ADDRESS" , async()=>{
    //given
    const reserveBalance = await innToken.balanceOf(CONSENSUS_ROLE_SIGNER);
    //when
    try{
      await innToken.burn( 1000 , {
        from :ADMIN_ROLE_SIGNER, 
      });
    }catch(error){};
    //then 
    const reserveBalancePrime = await innToken.balanceOf(CONSENSUS_ROLE_SIGNER);
    assert.equal(
      reserveBalance.toString(),
      reserveBalancePrime.toString()
    );
  });

  it("should only DEFAULT_ADMIN_ROLE burn from COMMISSION_WALLET_ADDRESS" , async()=>{
    //given
    await innToken.transfer(ADMIN_ROLE_SIGNER , 2000 , {
      from:CONSENSUS_ROLE_SIGNER,
    });
    const commisionBalance = await innToken.balanceOf(ADMIN_ROLE_SIGNER);
    //when
    await innToken.burn( 1000 , {
      from :ADMIN_ROLE_SIGNER, 
    });
    //then 
    const commisionBalancePrime = await innToken.balanceOf(ADMIN_ROLE_SIGNER);
    assert.equal(
      commisionBalancePrime.toString(),
      new web3.utils.BN(commisionBalance).sub(new web3.utils.BN("1000")).toString()
    );
  });

  it("should not any role expect DEFAULT_ADMIN_ROLE burn from COMMISSION_WALLET_ADDRESS" , async()=>{
    //given
    const commisionBalance = await innToken.balanceOf(ADMIN_ROLE_SIGNER);
    //when
    try{
      await innToken.burn( 500 , {
        from :COMMISSION_WALLET_ADDRESS, 
      });
    }catch(error){};

    //then 
    const commisionBalancePrime = await innToken.balanceOf(ADMIN_ROLE_SIGNER);
    assert.equal(
      commisionBalance.toString(),
      commisionBalancePrime.toString(),
    );
  });


});
