#!/usr/bin/nodejs

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));


function dvp(fromAddress, counterpartyAddress, tradeId, acceptToken, deliverToken, acceptAmount, deliverAmount) {
    web3.personal.unlockAccount(fromAddress, "password", 60 * 60 * 24, function(err, res) {
        if (err) {
            console.log("ERROR:", err);
        }
        web3.eth.defaultAccount = fromAddress;

        var contractAddress = '0xc2fb85cccee21f448e0ff93c5362c22713ee9af2';
        var abi = [{"constant":true,"inputs":[],"name":"allowOperation","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_allowOperation","type":"bool"}],"name":"setAllowOperation","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_counterparty","type":"address"},{"name":"_tradeId","type":"string"},{"name":"_acceptToken","type":"address"},{"name":"_deliverToken","type":"address"},{"name":"_acceptAmount","type":"uint256"},{"name":"_deliverAmount","type":"uint256"}],"name":"exchangeForValue","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Settled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tradeId","type":"string"}],"name":"Committed","type":"event"}];

        var dvpContract = web3.eth.contract(abi).at(contractAddress);

        dvpContract.exchangeForValue(counterpartyAddress, tradeId,
            acceptToken, deliverToken, acceptAmount, deliverAmount,
            function(err, res) {
                if (err) {
                    console.log('ERROR:', err)
                }
                console.log(res);
            });
    });
}


if (process.argv.length > 8) {
  dvp(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6], process.argv[7], process.argv[8]);
}
else {
  console.log("Usage: dvp fromAddress counterpartyAddress tradeId acceptToken deliverToken acceptAmount deliverAmount");
}
