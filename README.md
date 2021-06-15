# DEXToken Core V1

The DEXToken Protocol core smart contracts (the Specualtive AMM) V1. 

## DEXToken Protocol is DeFi AMM

DEXToken Protocol proposes a set of Automated Market Maker (AMM) algorithms specifically designed for DEX (Decentralized Exchange, decentralized exchange): Speculative AMM. For more information about Speculative AMM, please refer to [DEXToken Protocol Whitepaper: Building the DeFi Ecosystem](https://dextoken.io/assets/DEXToken-Protocol-Whitepaper-1.0-en.pdf).

## Documentation

* Developers: [docs.dexg.finance](https://docs.dexg.finance)
* Mainnet: [dexg.exchange](https://dexg.exchange)

## How to Use

1. Download and install:

```
$ git clone https://github.com/Dextoken/dextoken-core
$ cd dextoken-core
$ npm install
```

2. Deploy smart contracts:

```
$ truffle migrate --reset             ; deploy in local
```

3. Create test pools:

```
$ node scripts/01_createPool.js       ; the script will create a batch of pools
```

# Prerequisites

* [node v8+](https://nodejs.org)\
* [Truffle v5+](https://truffleframework.com)\
* Linux or Mac OS X
