pragma solidity >=0.4.22 <0.6.0;
import './token.sol';

contract Reserve {
    
    address payable owner;
    address public thisAddr = address(this);
    TestToken token;

    uint fixedUnit = 10**18;
    uint buyRate;
    uint sellRate;
    // uint buyRate = 900000000000000000;
    // uint sellRate = 1000000000000000000;
    
    constructor(address tokenAddr) public {
        
        owner = msg.sender;
        token = TestToken(tokenAddr);
        
    }
    
    function setExchangeRates(uint _buyRate, uint _sellRate) public isOwner {
        
        buyRate = _buyRate ;
        sellRate = _sellRate;
        
    }
    
    function getExchangeRate(bool isBuy, uint srcAmount) public view returns (uint) {
        
        if(isBuy) {
            
            if(srcAmount * fixedUnit / buyRate  <= token.balanceOf(thisAddr) ) {
                
                return buyRate;
            
                
            }
            else return 0;
        } else {
            
            if(srcAmount * sellRate / fixedUnit <= thisAddr.balance ) {
                return sellRate;
            }
            else return 0;
        }
        
    }

    function getTokenBalance() public view returns(uint) {
        
        return token.balanceOf(thisAddr);
        
    }
    
    function getBalance() public view returns(uint) {
        
        return thisAddr.balance;
    
    }
    
    function withdrawToken(uint amount, address destAddress) isOwner public {
        if(amount <= token.balanceOf(thisAddr)) {
            token.transfer(destAddress, amount);
        }
    }
    
    function withdraw(uint amount) isOwner public {
        if(address(this).balance >= amount) {
            owner.transfer(amount);
        }
    } 
    

    function exchange(bool isBuy, uint srcAmount, address from) public payable returns(uint)  {
        
        if(isBuy) {
            
            require(msg.value == srcAmount);
            
            uint destAmount = srcAmount * fixedUnit / buyRate;
            require(destAmount <= token.balanceOf(thisAddr));
            token.transfer(from, destAmount);
            return destAmount;
            
        } 
        else {
            
            require( token.allowance( msg.sender, thisAddr ) == srcAmount );
            token.transferFrom(msg.sender, thisAddr, srcAmount);
            
            uint destAmount = srcAmount * sellRate / fixedUnit;
            require(destAmount <= thisAddr.balance);
            
            address payable reciever = address(uint160(from));
            reciever.transfer(destAmount);
            return destAmount;

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