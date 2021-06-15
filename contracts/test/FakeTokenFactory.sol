pragma solidity 0.5.17;

import "../libraries//Math.sol";
import "../libraries/SafeMath.sol";
import "./FakeToken.sol";


contract FakeTokenFactory {
    using SafeMath for uint;

    event PoolCreated(address indexed token0, address pair, uint);

    mapping(address => address) public allPools;
    address []  allTokensAddress;

    constructor() public {   
    }

    function createFakeToken(
        string memory name, 
        string memory symbol, 
        uint8 decimals
    ) public returns (address token) {
        bytes memory bytecode = type(FakeToken).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(name, allTokensAddress.length, msg.sender));        
        /// precompute the address where a contract will be deployed
        assembly {
            token := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IFakeToken(token).initialize(name, symbol, decimals);
        allTokensAddress.push(token);
        return token;
    }

    function getAllTokens() external view returns (address [] memory) {
        return allTokensAddress;
    }           
}   