const FakeTokenFactory = artifacts.require('FakeTokenFactory');
const fs = require('fs');

module.exports = async function(deployer, network, [
	owner, account1, account2, account3, account4, account5
]) {
	let factoryInstance;

    // Deploy the Dextoken Contract
	await deployer.deploy(FakeTokenFactory);
    factoryInstance = await FakeTokenFactory.deployed();

    const data = 
    `VUE_APP_FAKE_CONTRACT_ADDRESS=${FakeTokenFactory.address}\n`;

    fs.writeFileSync('.env', data, {flag: "w"});  
};