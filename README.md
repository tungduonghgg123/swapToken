# swapToken - A Decentralized Exchange - MVP version
I created this repository for testing purpose for a course which is provided by Funix. 
http://studio.funix.edu.vn/courses/course-v1:FUNiX+BDP306x+2019_T9/course/
# The way I defined the exchange rates in Reserve contract maybe not usual:
Exchange rate consists of buy rate and sell rate. Let's say we want to trade from token A -> token B.
+ Buy rate: how many token A to trade 1 token B.
+ Sell rate: recieved how many token B when trading 1 token A.
## For example, if you input to setExchangeRates(4,5) => buyRate = 4 and sellRate = 5. As a result:
+ Buy procedure: 4 Token A = 1 token B
+ Sell procedure: 1 token A = 5 token B
# Supportted Features:
+ Connect with MATAMASK.
+ Trade between tokens.
+ Tested on Chrome.
+ Ask permission everytime when trading tokens.
+ It is not really a feature but insteading of relying on Beefy, I utilize webpack for bundling modules and front-end development server.

