import { getWeb3Instance, getTokenContract } from './services/web3Service';
import { getExchangeRate, getETHBalance, getSwapABI, generateTx, getApproveABI } from './services/networkService'
import MetamaskService from './services/accounts/MetamaskService';
import EnvConfig from "./configs/env";
import handlebars from 'handlebars/dist/handlebars.min.js'

const candidateTemplate = handlebars.compile(document.getElementById('candidateTemplate').innerHTML)

const tokens = EnvConfig.SUPPORTTED_TOKENS;
const web3 = getWeb3Instance();
const metamaskService = new MetamaskService(web3)
let defaultAccount;

web3.currentProvider.publicConfigStore.on('update', async (result) => {
  //update exchange rate
  //update user balance

  // showExchangeRate(getSourceAmount());
  defaultAccount = result.selectedAddress;
  showUserBalance(defaultAccount);

});
function fetchingAccount() {
  web3.eth.getAccounts(function (err, accounts) {
    if (err != null) {
      console.log(err)
    }
    else if (accounts.length === 0) {
      console.log('MetaMask is locked')
    }
    else {
      defaultAccount = accounts[0]
      showUserBalance(defaultAccount)
      console.log('MetaMask is unlocked')
    }
  });
}

function getTokenAddress(symbol) {
  return tokens.find(token => token.symbol == symbol).address
}
function showUserBalance(address) {
  const tokenSymbol = getSymbol('from')
  if (tokenSymbol == 'ETH') {
    getETHBalance(address).then((result) => {
      setUserBalance(result / 10 ** 18)
    }, (error) => {
      setUserBalance('can not get your balance.')
      console.log(error)
    })
    return;
  }
  const from = getTokenAddress(tokenSymbol)
  const contract = getTokenContract(from)
  contract.methods.balanceOf(address).call().then((result) => {
    setUserBalance(result / 10 ** 18)
  }, (error) => {
    setUserBalance('can not get your balance.')
    console.log(error)
  })
}
function setUserBalance(amount) {
  $('.userBalance').text(`My balance: ${amount} ${getSymbol('from')}`)
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
    message ? $('.swap__rate').text(message) : $('.swap__rate').text("We can not swap that amount!")
    $('.input-placeholder').text(0)
  }
  if (getSymbol('from') == getSymbol('to')) {
    denyService("Please choose a different destination token. ")
    return;
  }
  let isInitial = false
  /**
   * assuming that reserve contract always reserve at least 1 token
   */
  if (amount == -1 || amount == 0) {
    isInitial = true
    amount = 1
  }
  // get token address
  const from = getTokenAddress(getSymbol('from'))
  const to = getTokenAddress(getSymbol('to'))
  // get amount
  getExchangeRate(from, to, (amount * 10 ** 18).toString())
    .then((result) => {
      if (result == 0)
        denyService()
      else {
        const exchangeRate = result / 10 ** 18;
        const str = `1 ${getSymbol('from')} = ${exchangeRate} ${getSymbol('to')} `
        $('.swap__rate').text(str)
        if (isInitial)
          $('.input-placeholder').text(0)
        else
          $('.input-placeholder').text(amount * exchangeRate)
      }
    }, (error) => {
      console.log(error)
      denyService()
    })
}
function informUser(message) {
  $('.modal__content').text(message)
}
function processTx(srcSymbol, destSymbol, srcAmount, from) {
  // if srcTokenAddress == token
  const amount = srcAmount * 10 ** 18
  if (srcSymbol == 'ETH') {
    /// gen exchange tx (add value)-> send -> confirm
    const tx = {
      from,
      to: EnvConfig.EXCHANGE_CONTRACT_ADDRESS,
      gasPrice: EnvConfig.GAS_PRICE,
      value: amount,
      data: getSwapABI(getTokenAddress(srcSymbol), getTokenAddress(destSymbol), amount.toString())
    };
    informUser('Processing...')
    metamaskService.sendTransaction(tx).then((result) => {
      console.log(result)
      informUser('Success!')
    }, (e) => {
      console.log(e)
      informUser('Fail!')
    })
  }
  else {
    /// generate approve tx -> send -> confirm -> gen exchange tx -> confirm
    const to = getTokenAddress(srcSymbol)
    let tx = {
      from,
      to,
      gasPrice: EnvConfig.GAS_PRICE,
      data: getApproveABI(to, amount.toString())
    };
    metamaskService.sendTransaction(tx).then((result) => {
      console.log(result)
      informUser('Successful Approval! Please confirm this transaction to exchange.')
      tx = {
        from,
        to: EnvConfig.EXCHANGE_CONTRACT_ADDRESS,
        gasPrice: EnvConfig.GAS_PRICE,
        data: getSwapABI(getTokenAddress(srcSymbol), getTokenAddress(destSymbol), amount.toString())
      };
      console.log(tx)
      metamaskService.sendTransaction(tx).then((result) => {
        console.log(result)
        informUser('Success!')
      }, (e) => {
        console.log(e)
        informUser('Fail!')
      })
    }, (e) => {
      console.log(e)
      informUser('Please approve again!')
    })
  }

}
$(async function () {
  fetchTokenSymbol()
  await showExchangeRate(-1)
  fetchingAccount()
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
      case 'dropdown__content__from':
        $('#from-token').text(text);
        showUserBalance(defaultAccount)
        break;
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
    showUserBalance(defaultAccount)

  })
  // Handle on Swap Now button clicked
  $('#swap-button').on('click', async function () {
    const modalId = $(this).data('modal-id');
    $(`#${modalId}`).addClass('modal--active');
    processTx(getSymbol('from'), getSymbol('to'), getSourceAmount(), defaultAccount)
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
