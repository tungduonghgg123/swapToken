export default class MetamaskService {
  constructor(keystore) {
    this.web3 = getWeb3Instance();
    this.keystore = keystore;
  }

  sendTransaction(tx) {
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
}
