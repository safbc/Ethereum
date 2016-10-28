var keythereum = require("keythereum");
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

var accounts = {};

function listAccounts(cb){
  var accountList = [];
  for(var i in accounts){
    accountList.push(i);
  }
  if(cb){
    cb(accountList);
  } else {
    return accountList;
  }
}

function newAccount(cb){
  var privateKey = keythereum.create().privateKey.toString('hex');
  var address = keythereum.privateKeyToAddress(privateKey);
  accounts[address] = {
    privateKey: new Buffer(privateKey, 'hex'), 
    password:''
  };
  if(cb){
    cb(address);
  } else {
    return address;
  }
}

function signRawTransaction(rawTx, senderAddress, cb){
  web3.eth.getTransactionCount(senderAddress, function(err, nonce){
    rawTx.nonce = '0x'+nonce.toString(16);
    var tx = new Tx(rawTx);
    var privateKey = accounts[senderAddress].privateKey;
    tx.sign(privateKey);
    var serializedTx = tx.serialize();
    cb(serializedTx.toString('hex'));
  });
}

function getRawSendTx(fromAddress, toAddress, value, cb){
  var rawTx = {
    from: fromAddress,
    to: toAddress,
    gasPrice: '0x'+padToEven(Number(1).toString(16)),
    gasLimit: '0x'+padToEven(Number(1).toString(16)),
    value: value
  };
  if(cb){
    cb(rawTx);
  } else {
    return rawTx;
  }
}

function padToEven(n, z){
  return pad(n, n.length + n.length % 2, z);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

exports.NewAccount = newAccount;
exports.SignRawTransaction = signRawTransaction;
exports.GetRawSendTx = getRawSendTx;
exports.ListAccounts = listAccounts;
