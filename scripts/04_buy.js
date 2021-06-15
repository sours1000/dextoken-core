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

	const wethContractInstance = await wethContractRegistry.at(WETH, {from: owner});
	const erc20ContractInstance = await erc20ContractRegistry.at(WETH, {from: owner});

	const factoryContractInstance = await factoryContractRegistry.at(factoryContract, {from: owner});
	const fakeContractInstance = await fakeContractRegistry.at(fakeContract, {from: owner});

	const allPools = await factoryContractInstance.getAllPools();
	const allTokens = await fakeContractInstance.getAllTokens();

	// use UTC+0 time zone
	const now = moment.utc().unix();
	const deadline = now + 3600;

	for (var i = 0; i < allPools.length; i++) {
		let pool = allPools[i];
		let poolContractInstance = await poolContractRegistry.at(pool);

		let token = await poolContractInstance.getToken();	
		let tokenContractInstance = await tokenContractRegistry.at(token);

		// Get token information
		let symbol = await poolContractInstance.symbol({from: owner});
		let price = await poolContractInstance.getPrice({from: owner});
		let Ct = await poolContractInstance.getCirculatingSupply({from: owner});
		const Nt = await poolContractInstance.getUserbase({from: owner});

		// Check WETH balance and allowance
		let balance = await erc20ContractInstance.balanceOf(owner);
		let allowance = await erc20ContractInstance.allowance(owner, pool);
		console.log(`Balance(${owner}): ${fromWei(balance)} WETH, allowance: ${fromWei(allowance)}`);

		const amountIn = new Web3.utils.BN(toWei('0.05'));
		const maxAllowance = new Web3.utils.BN(toWei('100'));

		if (allowance.lt(amountIn)) {
			await erc20ContractInstance.approve(pool, maxAllowance, {from: owner});
			console.log(`Approving ${pool} for ${amountIn}`);
		}

		const tx = await poolContractInstance.swapExactETHForTokens(
			amountIn.toString(),
	        0,
	        Web3.utils.toWei('1000000'),
	        deadline,
	        {
	        	from: owner
	        }
    	);

    	const logTokenWithdraw = tx.logs[0];
    	const logSwapExactETHForToken = tx.logs[1];

		//    event SwapExactETHForToken(
		//        address indexed poolOut, 
		//        uint amountOut, 
		//        uint amountIn,
		//        address indexed account
		//    );
		const resultSwapExactETHForToken = logSwapExactETHForToken.args;
    	const amountOut = resultSwapExactETHForToken.amountOut.toString();

		console.log(`Buy ${fromWei(amountIn.toString())} ETH for ${amountOut} ${symbol}`);
		return amountOut;
	}
}

start();
