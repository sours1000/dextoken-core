const DextokenFactory = artifacts.require('DextokenFactory');
const FeePool = artifacts.require('FeePool');
const WETH = artifacts.require('WETH');
const fs = require('fs');

module.exports = async function(deployer, network, [
	owner, account1, account2, account3, account4, account5
]) {
	let factoryInstance;
    let _WETH;
    
    if (network === 'ropsten') _WETH = '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5';
    else _WETH = WETH.address;

    // Deploy the Dextoken Contract
	await deployer.deploy(DextokenFactory, _WETH);
    factoryInstance = await DextokenFactory.deployed();

    // Set the fee pool
    await factoryInstance.setFeePool(FeePool.address);

    const data = 
    `VUE_APP_FACTORY_CONTRACT_ADDRESS=${DextokenFactory.address}\n` +
    `ACCOUNT0=${owner}\n` +
    `ACCOUNT1=${account1}\n` +
    `ACCOUNT2=${account2}\n`;    

    fs.writeFileSync('.env', data, {flag: "a"});  
};