import { getExchangeRate } from "../services/networkService";
import { getTokenContract } from '../services/web3Service';
import EnvConfig from "../configs/env";
import $ from 'jquery'

const tokens = EnvConfig.TOKENS;
let balance = 0;
let swapDisabled = false

function initiateProject() {
    const defaultSrcSymbol = tokens[0].symbol;
    const defaultDestSymbol = tokens[1].symbol;

    initiateDropdown();
    initiateSelectedToken(defaultSrcSymbol, defaultDestSymbol);
}

function initiateDropdown() {
    let dropdownTokens = '';

    tokens.forEach((token) => {
        dropdownTokens += `<div class="dropdown__item">${token.symbol}</div>`;
    });

    $('.dropdown__content').html(dropdownTokens);
}

function initiateSelectedToken(srcSymbol, destSymbol) {
    $('#selected-src-symbol').html(srcSymbol);
    $('#selected-dest-symbol').html(destSymbol);
    $('#selected-transfer-token').html(srcSymbol);
}

function getTokenAddress(symbol) {
    if (!symbol)
        return;
    return tokens.find(token => token.symbol == symbol).address
}
function getSymbol(source) {
    switch (source) {
        case 'to':
            return $('#selected-dest-symbol').text();
        case 'from':
            return $('#selected-src-symbol').text();
    }
}
function getSourceAmount() {
    return $('#swap-source-amount').val();
}
function setUserBalance(amount) {
    if (amount == -1) {
        balance = 0;
        $('.userBalance').text('can not get your balance.')
        return
    }
    balance = amount
    $('.userBalance').text(`My balance: ${amount} ${getSymbol('from')}`)
}
function showUserBalance(address) {
    if (!address) {
        setUserBalance(-1)
        return;
    }

    const tokenSymbol = getSymbol('from')
    if (!tokenSymbol)
        return;
    if (tokenSymbol == 'ETH') {
        getETHBalance(address).then((result) => {
            setUserBalance(result / 10 ** 18)
        }, (error) => {
            setUserBalance(-1)
            console.log(error)
        })
        return;
    }
    const from = getTokenAddress(tokenSymbol)
    const contract = getTokenContract(from)
    contract.methods.balanceOf(address).call().then((result) => {
        setUserBalance(result / 10 ** 18)
    }, (error) => {
        setUserBalance(-1)
        console.log(error)
    })
}
async function showExchangeRate(amount) {
    function denyService(message) {
        message ? $('.swap__rate').text(message) : $('.swap__rate').text("We can not swap that amount!")
        $('.input-placeholder').text(0)
        swapDisabled = true;
    }

    if (getSymbol('from') == getSymbol('to')) {
        denyService("Please choose a different destination token. ")
        return;
    }

    if (amount > balance) {
        denyService(" You are not permited to swap that amount")
        return;
    }
    swapDisabled = false
    let isInitial = false
    swapDisabled = false
    /**
     * assuming that Reserve contract always reserve at least 1 token
     */
    if (amount == -1 || amount == 0) {
        swapDisabled = true
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
function swapButtonDisabled() {
    return swapDisabled
}
function informUser(message) {
    $('.modal__content').text(message)
}
export {
    swapButtonDisabled,
    initiateProject,
    getTokenAddress,
    getSymbol,
    setUserBalance,
    showUserBalance,
    getSourceAmount,
    informUser,
    showExchangeRate
}