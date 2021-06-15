const Web3 = require('web3')
const contract = require('truffle-contract');

let DextokenPool = artifacts.require('DextokenPool')
let DextokenFactory = artifacts.require('DextokenFactory')

// DEVELOPMENT ONLY
let FakeToken = artifacts.require('FakeToken')
let FakeWETH = artifacts.require('WETH')

let pool
let poolInstance
let poolContractAddress

let factory
let factoryInstance
let factoryContractAddress

let creator
let user1

// Utils
function toWei(amount) {
  return Web3.utils.toWei(amount.toString());
}

//deposit()
//      ✓ should fail when amount is zero
//      valid case
//        ✓ liquidity update
//        ✓ updates last update time
//        ✓ should increase totalBalance
//        ✓ should increase appropriate Ct
//        ✓ should increase appropriate TotalLiquidity
//        ✓ should mint lpToken
//        ✓ should transfer token

contract('deposit()', function(accounts,) {
  var now = parseInt(Date.now() / 1000)
  var start = now + 10
  var end = start + 20

  creator = accounts[0]
  user1 = accounts[1]

  it('should instantiate the pool factory', async function() {
    let tokenInstance = await FakeWETH.new();

    factoryInstance = await DextokenFactory.new(tokenInstance.address)
    factoryContractAddress = factoryInstance.address
    assert.equal(typeof factoryContractAddress, 'string')
  });

  it('should set the fee pool', async function() {
    let tx = await factoryInstance.setFeePool(creator)
    assert.equal(tx.receipt.status, true);
  });

  it('should create a pool', async function() {
    // DEVELOPMENT ONLY: Create a fake token
    let tokenInstance = await FakeToken.new()
    await tokenInstance.initialize('Fake DEXG', `fDEXG`, 18)
    await tokenInstance.mint(creator, toWei('55000'))

    let tx = await factoryInstance.createPool(
      tokenInstance.address,
      toWei('1908.354'),    // Ct
      toWei('0.188411'),    // Pt
      { from: creator }
    )

    assert.equal(tx.receipt.status, true);
  });

  it('should return all pools', async function() {
    return await factoryInstance.getAllPools().then(function(allPools) {
      poolContractAddress = allPools[0]
      poolInstance = DextokenPool.at(poolContractAddress)
      assert.equal(allPools.length, 1)
    });
  });

  it('should fail when amount is zero', async function() {
    return await poolInstance.deposit(toWei('0')).then(function(tx) {
      //assert.equal(balance, 0);
      assert.equal(tx.receipt.status, false);
    });
  });

  it('liquidity update', async function() {
    return await poolInstance.deposit(toWei('1')).then(function(tx) {
      assert.equal(tx.receipt.status, false);
    });
  });       
});