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
	const factoryContractInstance = await factoryContractRegistry.at(factoryContract, {from: owner});
	const fakeContractInstance = await fakeContractRegistry.at(fakeContract, {from: owner});
	const erc20ContractInstance = await erc20ContractRegistry.at(WETH, {from: owner});

	const allPools = await factoryContractInstance.getAllPools();
	const allTokens = await fakeContractInstance.getAllTokens();

	for (var i = 0; i < allPools.length; i++) {
		let pool = allPools[i];
		let poolContractInstance = await poolContractRegistry.at(pool);

		let token = await poolContractInstance.getToken();	
		let tokenContractInstance = await tokenContractRegistry.at(token);

		// Get ETH balance
		let balance = await erc20ContractInstance.balanceOf(pool);
		balance = fromWei(balance);

		// Get token information
		let symbol = await poolContractInstance.symbol({from: owner});
		let price = await poolContractInstance.getPrice({from: owner});
		let Ct = await poolContractInstance.getCirculatingSupply({from: owner});
		const Nt = await poolContractInstance.getUserbase({from: owner});

		// Get pool information
		const balancePool = await poolContractInstance.getPoolBalance();
		const liquidityPool = await poolContractInstance.getPoolLiquidity();

		console.log(`${symbol}: Price = ${price}, Ct = ${Ct}, Nt = ${Nt}, balancePool = ${balancePool}, WETH = ${balance}`);
	}	
}

start();