import { getWeb3Instance, getTokenContract, getExchangeContract } from './web3Service';
import EnvConfig from "../configs/env";
const web3 = getWeb3Instance()
const tokens = EnvConfig.SUPPORTTED_TOKENS;
const token2contract = new Map();
tokens.forEach(({address}) => {
  token2contract.set(address, getTokenContract(address));
})
const exchangeContract = getExchangeContract();

export function getSwapMethod(srcTokenAddress, destTokenAddress, srcAmount) {
  /*TODO: Get Swap ABI*/
  return exchangeContract.methods.exchange(srcTokenAddress, destTokenAddress, srcAmount)
}

export function getTransferABI(data) {
  /*TODO: Get Transfer ABI*/
}

export function getApproveABI(srcTokenAddress, amount) {
  /*TODO: Get Approve ABI*/
}

export function getAllowance(srcAddress, address, spender) {
  /*TODO: Get current allowance for a token in user wallet*/
}

export function getExchangeRate(srcAddress, destAddress, srcAmount) {
  /*TODO: Get Exchange Rate from Smart Contract*/
    return new Promise((resolve, reject) => {
        exchangeContract.methods.getExchangeRate(srcAddress, destAddress, srcAmount).call().then((result) => {
            resolve(result)
        }, (error) => {
            reject(error);
        })
    })
}

export async function getTokenBalances(tokens, address) {
  /*TODO: Get Token Balance*/
}

export function getETHBalance(address) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address).then((result) => {
      resolve(result)
    }, (error) => {
      reject(error)
    })
})
}
export function generateTx (method, from) {
  console.log(method)
  return new Promise((resolve, reject) => {
      method.estimateGas({gas: 5000000}).then((gas) => {
        console.log(gas)
          var tx = {
              from: from,
              to: exchangeContract.options.address,
              gas: gas * 2,
              gasPrice: 10000,
              data: method.encodeABI()
          };
          resolve(tx)
      }, (error) => {
        console.log('ahihi')
        reject(error)
      })

  })

}
export function sendTransaction(tx) {
  // TODO: Sending signed transaction by Metamask
  web3.eth.sendTransaction(tx)
    .on('receipt', receipt => {
      console.log(receipt);
      // resolve(receipt);
    })  
    .on('error', (error) => {
      // reject(error);
      console.log(error)
    });
}