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

	const allPools = await factoryContractInstance.getAllPools();
	const allTokens = await fakeContractInstance.getAllTokens();
	const poolContractInstances = [];

	for (var i = 0; i < allPools.length; i++) {
		poolContractInstances[i] = await poolContractRegistry.at(allPools[i]);
	}

	setInterval(async () => {
		let poolId = getRandomInt(allPools.length);
		let poolContractInstance = poolContractInstances[poolId];

		let token = await poolContractInstance.getToken();	
		let tokenContractInstance = await tokenContractRegistry.at(token);

		// Get token information
		let symbol = await poolContractInstance.symbol({from: owner});
		let price = await poolContractInstance.getPrice({from: owner});
		let Ct = await poolContractInstance.getCirculatingSupply({from: owner});
		const Nt = await poolContractInstance.getUserbase({from: owner});

		await poolContractInstance.deposit(toWei('0.1'), {from: owner});

		console.log(`Deposit 0.1 ${symbol} at price ${price}`);
	}, 1000)
}

start();