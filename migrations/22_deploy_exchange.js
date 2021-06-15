const DextokenExchange = artifacts.require('DextokenExchange');
const WETH = artifacts.require('WETH');
const fs = require('fs');

module.exports = async function(deployer, network, [
	owner, account1, account2, account3, account4, account5
]) {
	let exchangeInstance;
    let _WETH;
    
    if (network === 'ropsten') _WETH = '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5';
    else _WETH = WETH.address;

    // Deploy the Dextoken Contract
	await deployer.deploy(DextokenExchange, _WETH);
    exchangeInstance = await DextokenExchange.deployed();

    const data = 
    `VUE_APP_EXCHANGE_CONTRACT_ADDRESS=${DextokenExchange.address}\n`;

    fs.writeFileSync('.env', data, {flag: "a"});  
};