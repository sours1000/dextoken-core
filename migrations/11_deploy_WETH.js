const WETH = artifacts.require('WETH');
const fs = require('fs');

module.exports = async function(deployer, network, [
	owner, account1, account2, account3, account4, account5
]) {
	if (network !== 'development') return;
	let factoryInstance;

    // Deploy the Dextoken Contract
	await deployer.deploy(WETH);
    factoryInstance = await WETH.deployed();

    const data = 
    `VUE_APP_WETH_CONTRACT_ADDRESS=${WETH.address}\n`;

    fs.writeFileSync('.env', data, {flag: "a"});  
};