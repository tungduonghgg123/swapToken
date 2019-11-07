# swapToken
this repository resides in testing for a course which is provided by Funix

# The way I defined the exchange rates in Reserve contract maybe not usual:
Exchange rate consists of buy rate and sell rate. Let's say we want to trade from token A -> token B.
+ Buy rate: how many token A to trade 1 token B.
+ Sell rate: recieved how many token B when trading 1 token A.
For example, if you input to setExchangeRates(4,5) => buyRate = 4 and sellRate = 5. As a result:
+ Buy procedure: 4 Token A = 1 token B
+ Sell procedure: 1 token A = 5 token B
