import Web3 from "web3";
import EnvConfig from "../configs/env";

export function getWeb3Instance() {
  if (window.web3) {
    console.log('meta mask provider')
    return new Web3(window.web3.currentProvider);
  }

  return new Web3(Web3.givenProvider);
}

export function getTokenContract(tokenAddress) {
  const web3 = getWeb3Instance();
  return new web3.eth.Contract(EnvConfig.TOKEN_ABI, tokenAddress);
}

export function getExchangeContract() {
  /* DONE: Get Exchange Contract goes here */
  const web3 = getWeb3Instance();
  return new web3.eth.Contract(EnvConfig.EXCHANGE_ABI, EnvConfig.EXCHANGE_CONTRACT_ADDRESS);
}
