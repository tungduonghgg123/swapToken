import { getWeb3Instance } from './services/web3Service';
import {getExchangeRate} from './services/networkService'
import EnvConfig from "./configs/env";
import handlebars from 'handlebars/dist/handlebars.min.js'

const candidateTemplate = handlebars.compile(document.getElementById('candidateTemplate').innerHTML)

const tokens = EnvConfig.SUPPORTTED_TOKENS;
const web3 = getWeb3Instance();


web3.currentProvider.publicConfigStore.on('update', (result) => {
  //update exchange rate
  //update user balance
  console.log(result)
});
function isLocked() {
  web3.eth.getAccounts(function (err, accounts) {
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
function fetchTokenSymbol() {
  let candidates = document.getElementsByClassName('tokens');
  Array.prototype.forEach.call(candidates, function (element) {
    element.innerHTML = candidateTemplate(tokens)
  });
  $('#from-token').text(tokens[0].symbol);
  $('#to-token').text(tokens[1].symbol);
}
$(async function () {
  fetchTokenSymbol()
  await getExchangeRate('0x40aF51aFaa2967DE5E9872f77647A6C205ED4850', '0xCd6be9c5a3A62De9Bc3FBC32C63D3D1dE79858Dc', 0)
  isLocked()
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
    /* DONE: Select Token logic goes here */
    const text = $(this).text();

    switch ($(this).parents(".dropdown__content").attr('id')) {
      case 'dropdown__content__from': $('#from-token').text(text); break;
      case 'dropdown__content__to': $('#to-token').text(text); break;
    }
  });
  $('.swap__icon').on('click', function () {
    const from = $('#from-token').text();
    const to = $('#to-token').text();
    $('#from-token').text(to);
    $('#to-token').text(from);

  })
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
    if (e.target !== this) return;
    $(this).removeClass('modal--active');
  });
});
