const moment = require('moment');
require('dotenv').config();
const {
	factoryContractRegistry,
	fakeContractRegistry,
	exchangeContractRegistry,
	poolContractRegistry,
	tokenContractRegistry,
	wethContractRegistry,
	erc20ContractRegistry,

	fromWei,
	toWei,

	factoryContract,
	exchangeContract,
	fakeContract,
	WETH,
	accounts,
	Web3
} = require('./config.js');

const BN_1e18 = new Web3.utils.BN(toWei('1'));
const BN_0 = new Web3.utils.BN(toWei('0'));
const BN_98 = new Web3.utils.BN(toWei('98'));
const BN_99 = new Web3.utils.BN(toWei('99'));
const BN_100 = new Web3.utils.BN(toWei('100'));

async function start() {
	const owner = accounts[0];

	const factoryContractInstance = await factoryContractRegistry.at(factoryContract, {from: owner});
	const exchangeContractInstance = await exchangeContractRegistry.at(exchangeContract, {from: owner});
	const wethContractInstance = await erc20ContractRegistry.at(WETH, {from: owner});

	await exchangeContractInstance.initialize(WETH, {from: owner});
	const allPools = await factoryContractInstance.getAllPools();

	let poolIn = allPools[0];
	let poolOut = allPools[1];
	let poolInContractInstance = await poolContractRegistry.at(poolIn);
	let poolOutContractInstance = await poolContractRegistry.at(poolOut);
	let tokenIn = await poolInContractInstance.getToken();	
	let tokenOut = await poolOutContractInstance.getToken();	
	let tokenInContractInstance = await erc20ContractRegistry.at(tokenIn, {from: owner});
	let tokenOutContractInstance = await erc20ContractRegistry.at(tokenOut, {from: owner});

	// pricing
	let priceIn = await poolInContractInstance.getPrice();
	let priceOut = await poolOutContractInstance.getPrice();
	console.log(`----------------------------`);
	console.log(` 	In 		 			Out 		 			Exchange`);

	priceIn = new Web3.utils.BN(priceIn);
	priceOut = new Web3.utils.BN(priceOut);

	let closingPrice = priceOut.mul(BN_1e18).div(priceIn); // in BN
	console.log(`Price: ${fromWei(priceIn)} 	${fromWei(priceOut)}	closingPrice: ${fromWei(closingPrice)}`)

	let balanceIn = await poolInContractInstance.getPoolBalance();
	let balanceOut = await poolOutContractInstance.getPoolBalance();
	console.log(`Balance: ${fromWei(balanceIn)} 	${fromWei(balanceOut)}`)

	let amountOut = new Web3.utils.BN(toWei('0.01'));
	let amountIn = amountOut.mul(closingPrice).div(BN_1e18);
	console.log(`Swap amount: ${fromWei(amountIn)} 	${fromWei(amountOut)}`)

	let ethIn = await wethContractInstance.balanceOf(poolIn);
	let ethOut = await wethContractInstance.balanceOf(poolOut);
	let ethEx = await wethContractInstance.balanceOf(exchangeContract);
	console.log(`WETH balance: ${fromWei(ethIn)} 	${fromWei(ethOut)} 	${fromWei(ethEx)}`)
	console.log(`----------------------------`, ``);

	// views: account
	let account = accounts[0];
	let balance = await tokenInContractInstance.balanceOf(account)
	console.log(`User ${tokenIn} balance: ${balance}`);

	// views: status
	if (ethIn.lte(BN_0)) {
		return console.log(`${poolIn}: zero ETH liquidity`);
	}

	let amountOutETH = amountIn.mul(priceIn).div(BN_1e18);
	console.log(`amountIn = ${amountIn}, priceIn = ${priceIn}, amountOutETH = ${amountOutETH}`)

	if (ethIn.lt(amountOutETH)) {
		return console.log(`${poolIn}: Not enough ETH liquidity ${fromWei(ethIn)} < ${fromWei(amountOutETH)}`);
	}

	// views: approve DextokenExchange for tokenIn
	let allowance = await tokenInContractInstance.allowance(account, exchangeContract);

	if (allowance.lt(amountIn)) {
		await tokenInContractInstance.approve(exchangeContract, toWei('10000000'), {from: account});
		console.log(`Approving ${exchangeContract} for ${fromWei(amountIn)}`);
	} else {
		console.log(`Approved ${exchangeContract} for ${fromWei(allowance)}`);
	}

	// swap
	const now = moment.utc().unix();
	const deadline = now + 3600;	
	console.log(`Swap ${fromWei(amountIn)} for ${fromWei(amountOut)}, ETH ${fromWei(amountOutETH)}`);

	tx = await exchangeContractInstance.swapMaxAmountOut(
        poolIn,
        poolOut, 
        amountOut,
        deadline,
        {from: account}
    );
    const logs = tx.receipt.logs
    const result = logs[0].args

    console.log(``, logs);
    console.log(`poolIn: ${result.poolIn}`)
    console.log(`amountSwapIn: ${fromWei(result.amountSwapIn.toString())}`)
    console.log(`poolOut: ${result.poolOut}`)
    console.log(`exactAmountOut: ${fromWei(result.exactAmountOut.toString())}`)
}

start();
