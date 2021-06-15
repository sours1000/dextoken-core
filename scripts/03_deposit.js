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

	for (var i = 0; i < allPools.length; i++) {
		let pool = allPools[i];
		let poolContractInstance = await poolContractRegistry.at(pool);

		let token = await poolContractInstance.getToken();	
		let tokenContractInstance = await erc20ContractRegistry.at(token);

		// Get token information
		let symbol = await poolContractInstance.symbol({from: owner});
		let price = await poolContractInstance.getPrice({from: owner});
		let Ct = await poolContractInstance.getCirculatingSupply({from: owner});
		const Nt = await poolContractInstance.getUserbase({from: owner});
		console.log(`Pool: ${symbol} ${price} ${Ct} ${Nt}`)

		for (var j = 0; j < 1; j++) {
			let account = accounts[j];
			let allowance = fromWei(await tokenContractInstance.allowance(account, pool));
			let balance = fromWei(await tokenContractInstance.balanceOf(account));
			console.log(`allowance(${account}, ${symbol}): ${allowance}, balance(${account}, ${symbol}): ${balance}`);

			if (parseFloat(balance) >= 10) {
				await tokenContractInstance.approve(pool, toWei('10000000'), {from: account});
				await poolContractInstance.deposit(toWei('10'), {from: account});
				console.log(`${accounts[j]}: Deposit 10 ${symbol} to ${pool}`);
			}
		}
	}
}

start();