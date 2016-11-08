var contractRawTx = require('ethereum-transaction-creator');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

function getRawSendEther(from, to, value){
  var rawTx = {
    from: from, 
    to: to, 
    value: value
  };
  var gasCost = web3.eth.estimateGas(rawTx);
  rawTx.gasPrice = '0x'+padToEven(Number(1).toString(16));
  rawTx.gasLimit = '0x'+padToEven(Number(gasCost).toString(16));
  return rawTx;
}

function getRawContractTransfer(abi, contractAddress, fromAddress, toAddress, value, cb){
  contractRawTx.GetContractInstance(abi, contractAddress, function(xza){
    xza.transfer(toAddress, value, function(rawTx){
      rawTx.from = fromAddress;
      var nonce = web3.eth.getTransactionCount(fromAddress);
      rawTx.nonce = '0x'+nonce.toString(16);
      var gasCost = web3.eth.estimateGas(rawTx);
      rawTx.gasPrice = '0x'+padToEven(Number(1).toString(16));
      rawTx.gasLimit = '0x'+padToEven(Number(gasCost).toString(16));
      cb(rawTx);
    });
  });
} 

function adjustOwnerBalance(abi, contractAddress, fromAddress, increase, cb){
  contractRawTx.GetContractInstance(abi, contractAddress, function(xza){
    xza.adjustOwnerBalance(increase, function(rawTx){
      rawTx.from = fromAddress;
      var nonce = web3.eth.getTransactionCount(fromAddress);
      rawTx.nonce = '0x'+nonce.toString(16);
      var gasCost = web3.eth.estimateGas(rawTx);
      rawTx.gasPrice = '0x'+padToEven(Number(1).toString(16));
      rawTx.gasLimit = '0x'+padToEven(Number(gasCost).toString(16));
      cb(rawTx);
    });
  });
}

function padToEven(n, z){
  return pad(n, n.length + n.length % 2, z);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

exports.GetRawSendEther = getRawSendEther;
exports.GetRawContractTransfer = getRawContractTransfer;
exports.AdjustOwnerBalance = adjustOwnerBalance;
