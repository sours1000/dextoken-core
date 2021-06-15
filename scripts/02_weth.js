require('dotenv').config();
const {
	factoryContractRegistry,
	fakeContractRegistry,
	poolContractRegistry,
	tokenContractRegistry,
	wethContractRegistry,
	erc20ContractRegistry,

	fromWei,
	toWei,

	factoryContract,
	fakeContract,
	WETH,
	accounts,
	Web3
} = require('./config.js');

async function start() {
	const owner = accounts[0];

	const wethContractInstance = await wethContractRegistry.at(WETH, {from: owner});
	const erc20ContractInstance = await erc20ContractRegistry.at(WETH, {from: owner});

	for (var i = 0; i < accounts.length; i++) {
		let tx = await wethContractInstance.deposit({
			from: accounts[i],
			value: toWei('0.2')
		});
		let balance = await erc20ContractInstance.balanceOf(accounts[i]);
		console.log(`Balance(${accounts[i]}): ${fromWei(balance)}`);
	}
	//tx = await wethContractInstance.withdraw(toWei('0.1'), {from: owner});
	//balance = await erc20ContractInstance.balanceOf(owner);
	//console.log(`Balance(${owner}): ${fromWei(balance)}`);
}

start();
