export default class MetamaskService {
  constructor(web3) {
    this.web3 = web3;
  }

  sendTransaction(tx) {
    // TODO: Sending signed transaction by Metamask
    return new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction(tx)
        .on('receipt', receipt => {
          resolve(receipt);
        })  
        .on('error', (error) => {
          reject(error);
        });
    })
  }
}
