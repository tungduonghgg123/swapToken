import {getWeb3Instance, getTokenContract, getExchangeContract} from './services/web3Service';
import EnvConfig from "./configs/env";

const web3 = getWeb3Instance();
const TOMO = getTokenContract(EnvConfig.TOMO_TOKEN_ADDRESS);
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

web3.currentProvider.publicConfigStore.on('update', (result) => {
  console.log(result)
});
function isLocked() {

web3.eth.getAccounts(function(err, accounts){
    if (err != null) {
      console.log(err)
    }
    else if (accounts.length === 0) {
      console.log('MetaMask is locked')
    }
    else {
      console.log(accounts)
      console.log('MetaMask is unlocked')
    }
});
}
isLocked()
// web3.eth.sendTransaction({
//   to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
//   value: '1000000000000000'
// })
// .then(function(receipt){
//   console.log(receipt)
// });

$(function () {
  // Import Metamask
  $('#import-metamask').on('click', function () {
    /* DONE: Importing wallet by Metamask goes here. */
    let ethereum = window.ethereum;
    ethereum.enable();
  });

  // Handle on Source Amount Changed
  $('#swap-source-amount').on('keydown', function () {
    /* TODO: Fetching latest rate with new amount */
    
    console.log($(this).val())
    /* TODO: Updating dest amount */
  });

  // Handle on click token in Token Dropdown List
  $('.dropdown__item').on('click', function () {
    $(this).parents('.dropdown').removeClass('dropdown--active');
    /* TODO: Select Token logic goes here */
    const text = $(this).text();

    switch($(this).parents(".dropdown__content" ).attr('id')) {
      case 'dropdown__content__from': $('#from-token').text(text); console.log('ahihis'); break;
      case 'dropdown__content__to': $('#to-token').text(text); break;
    }

    

  });

  // Handle on Swap Now button clicked
  $('#swap-button').on('click', function () {
    const modalId = $(this).data('modal-id');
    $(`#${modalId}`).addClass('modal--active');

  });

  // Tab Processing
  $('.tab__item').on('click', function () {
    const contentId = $(this).data('content-id');
    $('.tab__item').removeClass('tab__item--active');
    $(this).addClass('tab__item--active');

    if (contentId === 'swap') {
      $('#swap').addClass('active');
      $('#transfer').removeClass('active');
    } else {
      $('#transfer').addClass('active');
      $('#swap').removeClass('active');
    }
  });

  // Dropdown Processing
  $('.dropdown__trigger').on('click', function () {
    $(this).parent().toggleClass('dropdown--active');
  });

  // Close Modal
  $('.modal').on('click', function (e) {
    if(e.target !== this ) return;
    $(this).removeClass('modal--active');
  });
});
