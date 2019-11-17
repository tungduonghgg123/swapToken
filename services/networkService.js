import { getWeb3Instance, getTokenContract, getExchangeContract, getReserveContract, getCalleeContract } from './web3Service';
import EnvConfig from "../configs/env";
const web3 = getWeb3Instance()
const tokens = EnvConfig.SUPPORTTED_TOKENS;
const token2contract = new Map();
tokens.forEach(({ address }) => {
  token2contract.set(address, getTokenContract(address));
})
const exchangeContract = getExchangeContract();

export function getSwapABI(srcTokenAddress, destTokenAddress, srcAmount) {
  return exchangeContract.methods.exchange(srcTokenAddress, destTokenAddress, srcAmount).encodeABI()
}

export function getTransferABI(data) {
  /*TODO: Get Transfer ABI*/
}

export function getApproveABI(srcTokenAddress, amount) {
  return token2contract.get(srcTokenAddress).methods.approve(exchangeContract.options.address, amount).encodeABI()
}

export function getAllowance(srcAddress, address, spender) {
  /*TODO: Get current allowance for a token in user wallet*/
}

export function getExchangeRate(srcAddress, destAddress, srcAmount) {
  /*TODO: Get Exchange Rate from Smart Contract*/
  return new Promise((resolve, reject) => {
    exchangeContract.methods.getExchangeRate(srcAddress, destAddress, srcAmount).call().then((result) => {
      if(srcAddress == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
        resolve(1 / result * 10**36)
      resolve(result)
    }, (error) => {
      reject(error);
    })
  })
}

export async function getTokenBalances(tokens, address) {
  /*DONE: Get Token Balance*/
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
export function generateTx(srcTokenAddress, destTokenAddress, srcAmount, from) {
  return {
    from: from,
    to: exchangeContract.options.address,
    gas: gas * 2,
    gasPrice: 10000,
    data: method.encodeABI()
  };
}