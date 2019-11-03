pragma solidity >=0.4.22 <0.6.0;
import './Reserve.sol';
import './token.sol';

contract Exchange {
    
    address nativeToken = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address thisAddr = address(this);
    address payable owner;
    mapping (address => Reserve) reserves;
    mapping (address => bool) reserved;
    uint fixedUnit = 10**18;

    constructor() public {
        
        owner = msg.sender;
        reserved[nativeToken] = true;
        // addReserve(0xCBbe6ec46746218A5beD5b336AB86a0A22804d39, 0xB87213121FB89CbD8B877Cb1Bb3FF84dD2869cfA);
        // addReserve(0xe90f4F8aeBa3AdE774CaC94245792085a451bC8E, 0x100eeE74459CB95583212869f9c0304e7cE11EAA);
        //Ropsten
        // addReserve(0x8B24Ab255016Fc8d337da7df730C7D7FC8d8102C, 0x39Ab408c5eB94cE03DB1C9F2EEa9A1a5083BE1c3);
    }
    function addReserve(address payable _reserve, address token) isOwner public {
        
        require(!reserved[token]);
        Reserve reserve = Reserve(_reserve);
        reserves[token] = reserve;
        reserved[token] = true;
        
    }

    function removeReserve() isOwner public {
        //TODO
    }
    function getExchangeRate(address srcToken, address destToken, uint srcAmount) public view returns (uint) {
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
            TestToken token = TestToken(srcToken);
            require( token.allowance( msg.sender, thisAddr ) == srcAmount );
            token.transferFrom( msg.sender, thisAddr, srcAmount );
            
            Reserve srcReserve = reserves[srcToken];
            token.approve( srcReserve.thisAddr(), srcAmount );
            
            uint ETHrecieved = srcReserve.exchange( false, srcAmount, thisAddr );
            
            // phase 2, buy destToken
            
            reserves[destToken].exchange.value(srcAmount)(true, ETHrecieved, msg.sender);

        }
    } 

    modifier isOwner() {
        require(
            msg.sender == owner,
            "you are not permitted to do this"
        );
        _;
    }
    function() external payable {}
}