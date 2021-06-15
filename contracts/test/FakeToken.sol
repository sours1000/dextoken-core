pragma solidity 0.5.17;

import "../libraries/Address.sol";
import "../libraries/Math.sol";
import "../libraries/SafeMath.sol";
import "../libraries/ERC20.sol";

interface IFakeToken {
    function initialize(string calldata name, string calldata symbol, uint8 decimals) external;
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function mint(address account, uint amount) external returns (bool success);
    function burn(address account, uint amount) external returns (bool success);
}

contract FakeToken is IFakeToken, ERC20 {
    using Address for address;
    using SafeMath for uint;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor () public {
    }

    function initialize(string memory name, string memory symbol, uint8 decimals) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;    
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mint an amount of tokens and transfer to the user
     * @param account The address of the user who will receive the tokens
     * @param amount The amount of tokens
     * @return The result of token minting
     */
    function mint(address account, uint amount) external returns (bool success) {
        _mint(account, amount);
        return true;
    }

    /**
     * @dev Burn an amount of tokens
     * @param account The address of the wallet
     * @param amount The amount of tokens to burn
     * @return The result of token burning
     */
    function burn(address account, uint amount) external returns (bool success) {
        _burn(account, amount);
        return true;
    }    
}