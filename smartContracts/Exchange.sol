pragma solidity ^0.4.17;
import './Reserve.sol';
import './token.sol';

contract Exchange {
    
    address nativeToken = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address thisAddr = address(this);
    address owner;
    mapping (address => Reserve) reserves;
    mapping (address => bool) reserved;
    uint fixedUnit = 10**18;

    function Exchange() public {
        
        owner = msg.sender;
        reserved[nativeToken] = true;
        addReserve(0x0DCd2F752394c41875e259e00bb44fd505297caF, 0x692a70D2e424a56D2C6C27aA97D1a86395877b3A);
        addReserve(0x5E72914535f202659083Db3a02C984188Fa26e9f, 0xbBF289D846208c16EDc8474705C748aff07732dB);

    }
    function addReserve(address _reserve, address token) isOwner public {
        
        require(!reserved[token]);
        Reserve reserve = Reserve(_reserve);
        reserves[token] = reserve;
        reserved[token] = true;
        
    }

    function getExchangeRate(address srcToken, address destToken, uint srcAmount) public view returns (uint) {
        require(srcAmount > 0);
        require(reserved[srcToken] && reserved[destToken]);
        if(srcToken == nativeToken) {
            return reserves[destToken].getExchangeRate(true, srcAmount);
        } else if (destToken == nativeToken) {
            return reserves[srcToken].getExchangeRate(false, srcAmount);
        } else {
            uint sellRate4srcToken = reserves[srcToken].getExchangeRate(false, srcAmount);
            uint srcToken2ETH = srcAmount * sellRate4srcToken / fixedUnit;
            uint buyRate4destToken = reserves[destToken].getExchangeRate(true, srcToken2ETH);
            
            if(buyRate4destToken > 0 && sellRate4srcToken > 0)
                return sellRate4srcToken * fixedUnit/ buyRate4destToken;
            return 0;
        }
    }

    function exchange(address srcToken , address destToken, uint srcAmount) payable public {
        require(srcAmount > 0);
        require(reserved[srcToken] && reserved[destToken]);
        
        if(srcToken == nativeToken) {
            
            require(msg.value == srcAmount);
            reserves[destToken].exchange.value(srcAmount)(true, srcAmount, msg.sender);
             
        } else if (destToken == nativeToken) {
            
            TestToken token = TestToken(srcToken);
            require( token.allowance( msg.sender, thisAddr ) == srcAmount );
            token.transferFrom( msg.sender, thisAddr, srcAmount );
            
            Reserve srcReserve = reserves[srcToken];
            token.approve( srcReserve.thisAddr(), srcAmount );
            
            srcReserve.exchange( false, srcAmount, msg.sender );
            
        } else {
            // phase 1, sell token
            token = TestToken(srcToken);
            require( token.allowance( msg.sender, thisAddr ) == srcAmount );
            token.transferFrom( msg.sender, thisAddr, srcAmount );
            
            srcReserve = reserves[srcToken];
            token.approve( srcReserve.thisAddr(), srcAmount );
            
            uint ETHrecieved = srcReserve.exchange( false, srcAmount, thisAddr );
            
            // phase 2, buy destToken
            
            reserves[destToken].exchange.value(ETHrecieved)(true, ETHrecieved, msg.sender);

        }
    } 

    modifier isOwner() {
        require(
            msg.sender == owner
        );
        _;
    }
    function() external payable {}
}