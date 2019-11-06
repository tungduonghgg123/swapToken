import { getWeb3Instance } from './services/web3Service';
import { getExchangeRate } from './services/networkService'
import EnvConfig from "./configs/env";
import handlebars from 'handlebars/dist/handlebars.min.js'

const candidateTemplate = handlebars.compile(document.getElementById('candidateTemplate').innerHTML)

const tokens = EnvConfig.SUPPORTTED_TOKENS;
const web3 = getWeb3Instance();


web3.currentProvider.publicConfigStore.on('update', async (result) => {
  //update exchange rate
  //update user balance

  // await showExchangeRate()
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
function getSymbol(source) {
  switch (source) {
    case 'to':
      return $('#to-token').text();
    case 'from':
      return $('#from-token').text();
  }
}
function getSourceAmount() {
  return $('#swap-source-amount').val();
}
async function showExchangeRate(amount) {
  function denyService(message) {
    message?$('.swap__rate').text(message) : $('.swap__rate').text("We can not swap that amount!")
    $('.input-placeholder').text(0)
  }
  if(getSymbol('from') == getSymbol('to')) {
    denyService("Please choose a different destination token. ")
    return;
  }
  // get token address
  const from = tokens.find(token => token.symbol == getSymbol('from')).address
  const to = tokens.find(token => token.symbol == getSymbol('to')).address
  // get amount
  getExchangeRate(from, to, (amount * 10 ** 18).toString())
  .then((result) => {
    if (result == 0)
      denyService()
    else {
      const exchangeRate = result / 10 ** 18;
      const str = `1 ${getSymbol('from')} = ${exchangeRate} ${getSymbol('to')} `
      $('.swap__rate').text(str)

      $('.input-placeholder').text(amount * exchangeRate)
    }
  }, (error) => {
    console.log(error)
    denyService()
  })

}
$(async function () {
  fetchTokenSymbol()
  // await showExchangeRate()
  isLocked()
  // Import Metamask
  $('#import-metamask').on('click', function () {
    /* DONE: Importing wallet by Metamask goes here. */
    let ethereum = window.ethereum;
    ethereum.enable();
  });

  // Handle on Source Amount Changed
  $('#swap-source-amount').on('input change', function () {
    /* DONE: Fetching latest rate with new amount */  
    showExchangeRate($(this).val())
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
    showExchangeRate(getSourceAmount())
  });
  $('.swap__icon').on('click', function () {
    const from = getSymbol('from')
    const to = getSymbol('to')
    $('#from-token').text(to);
    $('#to-token').text(from);
    showExchangeRate(getSourceAmount())

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
