import { getWeb3Instance, getTokenContract } from '../services/web3Service';
import { getExchangeRate, getETHBalance, getSwapABI, getApproveABI } from '../services/networkService'
import MetamaskService from '../services/accounts/MetamaskService';
import { showUserBalance, getSymbol, getTokenAddress, informUser} from './index'
import EnvConfig from "../configs/env";

let defaultAccount;
const web3 = getWeb3Instance();
const metamaskService = new MetamaskService(web3)
web3.currentProvider.publicConfigStore.on('update', async (result) => {
    //update exchange rate
    //update user balance

    // showExchangeRate(getSourceAmount());
    defaultAccount = result.selectedAddress;
    showUserBalance(defaultAccount);

});
export function fetchingAccount() {
    web3.eth.getAccounts(function (err, accounts) {
        if (err != null) {
            window.alert(err)
        }
        else if (accounts.length === 0) {
            window.alert('Connect to your metamask account')
        }
        else {
            defaultAccount = accounts[0]
            // showUserBalance(defaultAccount)
        }
    });
}

function processTx(srcSymbol, destSymbol, srcAmount, from) {
    // if srcTokenAddress == token
    const amount = srcAmount * 10 ** 18
    informUser('Processing...')
    if (srcSymbol == 'ETH') {
        /// gen exchange tx (add value)-> send -> confirm
        const tx = {
            from,
            to: EnvConfig.EXCHANGE_CONTRACT_ADDRESS,
            gasPrice: EnvConfig.GAS_PRICE,
            value: amount,
            data: getSwapABI(getTokenAddress(srcSymbol), getTokenAddress(destSymbol), amount.toString())
        };
        metamaskService.sendTransaction(tx).then((result) => {
            console.log(result)
            informUser('Success!')
        }, (e) => {
            console.log(e)
            informUser('Fail!')
        })
    }
    else {
        /// generate approve tx -> send -> confirm -> gen exchange tx -> confirm
        const to = getTokenAddress(srcSymbol)
        let tx = {
            from,
            to,
            gasPrice: EnvConfig.GAS_PRICE,
            data: getApproveABI(to, amount.toString())
        };
        metamaskService.sendTransaction(tx).then((result) => {
            console.log(result)
            informUser('Successful Approval! Please confirm this transaction to exchange.')
            tx = {
                from,
                to: EnvConfig.EXCHANGE_CONTRACT_ADDRESS,
                gasPrice: EnvConfig.GAS_PRICE,
                data: getSwapABI(getTokenAddress(srcSymbol), getTokenAddress(destSymbol), amount.toString())
            };
            console.log(tx)
            metamaskService.sendTransaction(tx).then((result) => {
                console.log(result)
                informUser('Success!')
            }, (e) => {
                console.log(e)
                informUser('Fail!')
            })
        }, (e) => {
            console.log(e)
            informUser('Please approve again!')
        })
    }

}
function getDefaultAccount() {
    return defaultAccount
}
export {
    processTx,
    getDefaultAccount
}