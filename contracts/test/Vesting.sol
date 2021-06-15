// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.5.17; 

import "../libraries/Math.sol";
import "../libraries/SafeMath.sol";
import "../libraries/Owned.sol";
import "../libraries/SafeERC20.sol";


/**
 * @title Vesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period. Optionally revocable by the
 * owner.
 */
contract Vesting is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IERC20 private _tokenReward;
    address private _beneficiary;

    uint256 private _cliff;
    uint256 private _start;
    uint256 private _duration;

    mapping (address => uint256) private _released;

    constructor() public Ownable() {
    }

    /// In case of airdrops
    function gulp(address _token) onlyOwner external {
        require(_token != address(_tokenReward), "gulp: can not capture staking tokens");
        require(_beneficiary != address(this), "gulp: can not send to self");
        require(_beneficiary != address(0), "gulp: can not burn tokens");
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).safeTransfer(_beneficiary, balance);
    }  

    /**
     * @dev Creates a vesting contract that vests its balance of FLC token to the
     * beneficiary, gradually in a linear fashion until start + duration. By then all
     * of the balance will have vested.
     * @param beneficiary address of the beneficiary to whom vested tokens are transferred     
     * @param cliffDuration duration in seconds of the cliff in which tokens will begin to vest
     * @param start the time (as Unix time) at which point vesting starts
     * @param duration duration in seconds of the period in which the tokens will vest
     * @param addressOfTokenUsedAsReward where is the token contract
     */
    function createVestingPeriod(
        address beneficiary, 
        uint256 start, 
        uint256 cliffDuration, 
        uint256 duration, 
        address addressOfTokenUsedAsReward
    ) 
        onlyOwner 
        external 
    {
        require(cliffDuration <= duration, "createVestingPeriod: INVALID_CLIFF");
        require(duration > 0, "createVestingPeriod: INVALID_DURATION");
        require(start.add(duration) > block.timestamp, "createVestingPeriod: NOT_RELEASABLE");

        _beneficiary = beneficiary;
        _duration = duration;
        _cliff = start.add(cliffDuration);
        _start = start;
        _tokenReward = IERC20(addressOfTokenUsedAsReward);
    }

    /**
     * @return the beneficiary of the tokens.
     */
    function beneficiary() external view returns (address) {
        return _beneficiary;
    }

    /**
     * @return the cliff time of the token vesting.
     */
    function cliff() external view returns (uint256) {
        return _cliff;
    }

    /**
     * @return the start time of the token vesting.
     */
    function start() external view returns (uint256) {
        return _start;
    }

    /**
     * @return the duration of the token vesting.
     */
    function duration() external view returns (uint256) {
        return _duration;
    }

    /**
     * @return the amount of the token released.
     */
    function released(address token) external view returns (uint256) {
        return _released[token];
    }

    /**
     * @notice Mints and transfers tokens to beneficiary.
     * @param token ERC20 token which is being vested
     */
    function release(address token) onlyOwner external {
        uint256 unreleased = _releasableAmount(token);
        require(unreleased > 0, "release: NOT_RELEASABLE");
        _released[token] = _released[token].add(unreleased);
        _tokenReward.transfer(_beneficiary, unreleased);
    }

    /**
     * @dev Calculates the amount that has already vested but hasn't been released yet.
     * @param token ERC20 token which is being vested
     */
    function _releasableAmount(address token) private view returns (uint256) {
        return _vestedAmount(token).sub(_released[token]);
    }

    /**
     * @dev Calculates the amount that has already vested.
     * @param token ERC20 token which is being vested
     */
    function _vestedAmount(address token) private view returns (uint256) {
        uint256 currentBalance = _tokenReward.balanceOf(address(this));
        uint256 totalBalance = currentBalance.add(_released[token]);

        if (block.timestamp < _cliff) {
            return 0;
        } else if (block.timestamp >= _start.add(_duration)) {
            return totalBalance;
        } else {
            return totalBalance.mul(block.timestamp.sub(_start)).div(_duration);
        }
    }
}