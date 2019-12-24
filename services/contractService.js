import {getWeb3Instance, getTokenContract, getExchangeContract} from './/web3Service';
import EnvConfig from "../configs/env";

const web3 = getWeb3Instance();
const TOMO = getTokenContract(EnvConfig.TOMO_TOKEN_ADDRESS);
const tokens = EnvConfig.TOKENS;

// web3.eth.sendTransaction({
//   to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
//   value: '1000000000000000'
// })
// .then(function(receipt){
//   console.log(receipt)
// });

var getTokenName = ( contract) => {
    return new Promise((resolve, reject) => {
        contract.methods.name().call().then((result) => {
            resolve(result)
        }, (error) => {
            reject(error);
        })
    })
}
  // const tx = {
  //   to: contractInstance.options.address,
  //   gas: gas * 2,
  //   gasPrice: 1000000000,
  //   data: method.encodeABI()
  // };
  
    