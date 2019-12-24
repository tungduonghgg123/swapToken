import $ from 'jquery'
import {
  initiateProject, fetchingAccount, getSymbol, showUserBalance,
  getSourceAmount, showExchangeRate, swapButtonDisabled, informUser, getDefaultAccount, processTx, 
} from './helper/'


$(async function () {
  
  initiateProject()
  await showExchangeRate(-1)
  fetchingAccount()

  // Import Metamask
  $('#import-metamask').on('click', function () {
    let ethereum = window.ethereum;
    ethereum.enable();
  });

  // Handle on Source Amount Changed
  $('#swap-source-amount').on('input change', function () {
    showExchangeRate($(this).val())
  });

  // Handle on click token in Token Dropdown List
  $('.dropdown__item').on('click', function () {
    $(this).parents('.dropdown').removeClass('dropdown--active');
    const text = $(this).text();

    switch ($(this).parents(".dropdown__content").attr('id')) {
      case 'dropdown__content__from':
        $('#selected-src-symbol').text(text);
        showUserBalance(getDefaultAccount())
        break;
      case 'dropdown__content__to': $('#selected-dest-symbol').text(text); break;
    }
    showExchangeRate(getSourceAmount())
  });
  $('.swap__icon').on('click', function () {
    const from = getSymbol('from')
    const to = getSymbol('to')
    $('#selected-src-symbol').text(to);
    $('#selected-dest-symbol').text(from);
    showExchangeRate(getSourceAmount())
    showUserBalance(getDefaultAccount())

  })
  // Handle on Swap Now button clicked
  $('#swap-button').on('click', async function () {
    const modalId = $(this).data('modal-id');
    $(`#${modalId}`).addClass('modal--active');
    if (swapButtonDisabled()) {
      informUser('You are not allowed to do that!')
      return;
    }
    processTx(getSymbol('from'), getSymbol('to'), getSourceAmount(), getDefaultAccount())
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
  $('#transfer-button').on('click', async function () {
    const modalId = $(this).data('modal-id');
    $(`#${modalId}`).addClass('modal--active');
    informUser('Future Feature')
  });
});
