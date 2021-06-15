const moment = require('moment');
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

	// use UTC+0 time zone
	const now = moment.utc().unix();
	const deadline = now + 3600;

	for (var i = 0; i < 1; i++) {
		let pool = allPools[i];
		let poolContractInstance = await poolContractRegistry.at(pool);

		let token = await poolContractInstance.getToken();	
		let tokenContractInstance = await tokenContractRegistry.at(token);

		// Get token information
		let symbol = await poolContractInstance.symbol({from: owner});
		let price = await poolContractInstance.getPrice({from: owner});
		let Ct = await poolContractInstance.getCirculatingSupply({from: owner});
		const Nt = await poolContractInstance.getUserbase({from: owner});

		// Sell
        let amountIn = Web3.utils.toWei('0.01')
        let minAmountOut = Web3.utils.toWei('0.00000001')
        let minPrice = Web3.utils.toWei('0.00000001')

        try {
			const tx = await poolContractInstance.swapExactTokensForETH(
		        amountIn,
		        minAmountOut,
		        minPrice,
		        deadline,
		        {
		        	from: owner
		        }
	    	);
        } catch (e) {
        	console.log(e)
        }

		console.log(`Sell ${symbol}`);
	}
}

start();