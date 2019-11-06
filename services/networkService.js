import { getWeb3Instance, getTokenContract, getExchangeContract } from './web3Service';
import EnvConfig from "../configs/env";
const web3 = getWeb3Instance()
const tokens = EnvConfig.SUPPORTTED_TOKENS;
const token2contract = new Map();
tokens.forEach(({address}) => {
  token2contract.set(address, getTokenContract(address));
})
const exchangeContract = getExchangeContract();

export function getSwapABI(data) {
  /*TODO: Get Swap ABI*/
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

export async function getExchangeRate(srcAddress, destAddress, srcAmount) {
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
