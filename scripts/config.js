const fs = require('fs');
const Web3 = require('web3');
const contract = require('truffle-contract');

// development
const developmentProvider = new Web3.providers.HttpProvider("http://localhost:7545");

// mainet
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = fs.readFileSync(".secrets").toString().trim();
const infuraKey = fs.readFileSync(".secrets.infura-key").toString().trim();

const ropstenProvider = new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`);

// provider
const provider = ropstenProvider;

const factoryContractJson = require("../build/contracts/DextokenFactory.json");
const factoryContractRegistry = contract(factoryContractJson);
factoryContractRegistry.setProvider(provider);

const fakeContractJson = require("../build/contracts/FakeTokenFactory.json");
const fakeContractRegistry = contract(fakeContractJson);
fakeContractRegistry.setProvider(provider);

const exchangeContractJson = require("../build/contracts/DextokenExchange.json");
const exchangeContractRegistry = contract(exchangeContractJson);
exchangeContractRegistry.setProvider(provider);

const poolContractJson = require("../build/contracts/DextokenPool.json");
const poolContractRegistry = contract(poolContractJson);
poolContractRegistry.setProvider(provider);

const tokenContractJson = require("../build/contracts/FakeToken.json");
const tokenContractRegistry = contract(tokenContractJson);
tokenContractRegistry.setProvider(provider);

const wethContractJson = require("../build/contracts/IWETH.json");
const wethContractRegistry = contract(wethContractJson);
wethContractRegistry.setProvider(provider);

const erc20ContractJson = require("../build/contracts/IERC20.json");
const erc20ContractRegistry = contract(erc20ContractJson);
erc20ContractRegistry.setProvider(provider);

const factoryContract = process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS;
const exchangeContract = process.env.VUE_APP_EXCHANGE_CONTRACT_ADDRESS;
const fakeContract = process.env.VUE_APP_FAKE_CONTRACT_ADDRESS;
const WETH = {
	'ropsten': '0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5',
	'development': process.env.VUE_APP_WETH_CONTRACT_ADDRESS,
}

const accounts = [
	process.env.ACCOUNT0,
	process.env.ACCOUNT1, 
	process.env.ACCOUNT2
];

function toWei(amount) {
  return Web3.utils.toWei(amount.toString());
}

function fromWei(amount) {
  return Web3.utils.fromWei(amount.toString());
}

const web3 = new Web3(provider)

module.exports = {
	factoryContractRegistry,
	fakeContractRegistry,
	exchangeContractRegistry,
	poolContractRegistry,
	tokenContractRegistry,
	wethContractRegistry,
	erc20ContractRegistry,

	toWei,
	fromWei,

	factoryContract,
	exchangeContract,
	fakeContract,
	WETH,
	accounts,
	Web3,
	web3
};
