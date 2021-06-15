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

const tokenList = [
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},
	{
		name: 'DEXToken Governance',
		symbol: 'DEXG',
		decimals: 18
	},		
];

async function start() {
	const owner = accounts[0];

	const factoryContractInstance = await factoryContractRegistry.at(factoryContract, {from: owner});
	const fakeContractInstance = await fakeContractRegistry.at(fakeContract, {from: owner});

	await fakeContractInstance.createFakeToken(
		'Fake DEXG',
		`DEXG`,
		18,
		{from: owner}
	);

	for (var i = 0; i < tokenList.length; i++) {
		await fakeContractInstance.createFakeToken(
			tokenList[i].name,
			`${tokenList[i].symbol}-${i}`,
			tokenList[i].decimals,
			{from: owner}	
		);
	}

	const allTokens = await fakeContractInstance.getAllTokens();

	for (var i = 0; i < allTokens.length; i++) {
		let amount = '1000';

		for (var j = 0; j < accounts.length; j++) {
			let tokenContrctInstance = await tokenContractRegistry.at(allTokens[i], {from: accounts[j]});
			await tokenContrctInstance.mint(accounts[j], Web3.utils.toWei(amount.toString()), {from: accounts[j]});
			console.log(`Mint(${allTokens[i]}) ${amount} to '${accounts[j]}'`);
		}
	}

	for (var i = 0; i < allTokens.length; i++) {
		let eth = 30000 - i*500;

		let pool = await factoryContractInstance.createPool(
			allTokens[i],
			Web3.utils.toWei('42000'),
			Web3.utils.toWei(`${eth}`),
			WETH,
			{from: owner}	
		);
		console.log(`createPool(${allTokens[i]}) ${pool}`);
	}

	const pools = await factoryContractInstance.getAllPools();
	console.log(`all pools ${pools}`);
}	

start();
