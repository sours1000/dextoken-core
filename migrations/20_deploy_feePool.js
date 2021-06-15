const FeePool = artifacts.require('FeePool');
const fs = require('fs');

const stakingToken = '0x1783877Beb8E7F6291F4bA4aEC8E27C493fdF444'; // DEXG on Ropsten
const rewardToken = '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5'; // WETH on Ropsten

module.exports = async function(deployer, network, [
	owner, account1, account2, account3, account4, account5
]) {
	let factoryInstance;

    // Deploy the Dextoken Contract
	await deployer.deploy(FeePool, stakingToken, rewardToken);
    feePoolInstance = await FeePool.deployed();

    const data = 
    `VUE_APP_FEE_POOL_CONTRACT_ADDRESS=${FeePool.address}\n`;

    fs.writeFileSync('.env', data, {flag: "a"});  
};