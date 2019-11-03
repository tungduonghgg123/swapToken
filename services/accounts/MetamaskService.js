export default class MetamaskService {
  constructor(keystore) {
    this.web3 = getWeb3Instance();
    this.keystore = keystore;
  }

  sendTransaction(txObject) {
    // TODO: Sending signed transaction by Metamask
  }
}
