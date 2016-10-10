var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function getBlockNumberFromTerminal(rl, cb){
  rl.question('Enter the blockNumber: ', function(blockNumber){
    cb(blockNumber);
  });
}

function getBlockByBlockNumber(blockNumber, cb){
  web3.eth.getBlock(blockNumber, function(err, block){
    if(err){console.log('ERROR:', err);}
    cb(block);
  });
}

function submitDvPContract(cb) {
  var rootDirectory = __dirname.replace("TerminalClient", "");
  var tokenContractFilePath = rootDirectory + 'Contracts/testDvP.sol';
  fs.readFile(tokenContractFilePath, 'utf8', function(err, source) {
    if (err) { console.log("ERROR:", err); }
    web3.personal.unlockAccount(web3.eth.coinbase, "1234", 60 * 60 * 24, function(err, res) {
      if (err) { console.log("ERROR:", err); }
      web3.eth.defaultAccount = web3.eth.coinbase;
      var compiled = web3.eth.compile.solidity(source);
      var code = compiled.DvP.code;
      var abi = compiled.DvP.info.abiDefinition;

      web3.eth.contract(abi).new({
          data: code,
          gas: 1000000,
          gasPrice: 1
      }, function(err, contract) { // Note that this callback is called twice
          if (err) {
              console.error("ERROR:", err); // Log any errors
              cb();
          } else if (contract.address) { // If this contract has an address it means that it has been mined and included into the blockchain
              console.log('Contract mined, address: ' + contract.address);
              cb({
                  contractAddress: contract.address,
                  contractABI: abi
              });
          }
      });
    });
  });
}


function submitTokenContract(tokenName, numberOfTokens, shortTokenName, accountAddress, cb){
  var rootDirectory = __dirname.replace("TerminalClient", "");
  var tokenContractFilePath = rootDirectory + '/Contracts/testToken.sol';
  fs.readFile(tokenContractFilePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
    web3.personal.unlockAccount(accountAddress, "1234", 60*60*24, function(err, res){
      if(err){console.log("ERROR:", err);}
      web3.eth.defaultAccount = accountAddress;
      var compiled = web3.eth.compile.solidity(source);
      var code = compiled.Token.code;
      var abi = compiled.Token.info.abiDefinition;

      web3.eth.contract(abi).new(numberOfTokens, tokenName, shortTokenName, 2, {data: code, gas: 1000000, gasPrice: 1}, function (err, contract) { // Note that this callback is called twice
        if(err) {
          console.error("ERROR:", err); 	// Log any errors
          cb();
        } else if(contract.address){	// If this contract has an address it means that it has been mined and included into the blockchain
          console.log('Contract mined, address: ' + contract.address);
          cb({
            contractABI: abi,
            contractAddress: contract.address
          });
        }
      });
    });
  });
}

function getTokenInstance(contractABI, contractAddress){
  var tokenContract_ = web3.eth.contract(contractABI);
  var token = tokenContract_.at(contractAddress);
  return token;
}

var asset1 = {
  address: null,
  abi: null
}

var asset2 = {
  address: null,
  abi: null
}

var dvpContract = {
  address: null,
  abi: null
}

function run(){
  rl.question('What would you like to do: '+
    '\n1) Deploy Asset1 contract with 1000000 tokens:'+
    '\n2) Deploy Asset2 contract with 1000000 tokens:'+
    '\n3) Deploy DVP contract:'+
    '\n4) Auth both assets for account 1'+
    '\n5) Auth both assets for account 2'+
    '\n6) Get all balances'+
    '\n7) DVP asset1 from account1 for asset2 from account2'+
    '\n8) DVP asset2 from account2 for asset1 from account1'+
    '\n0) Quit'+
    '\n> ', function(answer){
    if(answer == 0){
      console.log('Quiting');
      rl.close();
      return;
    } else if (answer == 8){
      web3.eth.defaultAccount = web3.eth.accounts[2];
      var dvpContractInstance = getTokenInstance(dvpContract.abi, dvpContract.address);       
      dvpContractInstance.exchangeForValue(web3.eth.accounts[1]
        , 'trade123', asset1.address, asset2.address, 100, 100
        , {gas: 1000000, gasPrice:1}, function(err, res1){
        if(err){console.log('ERROR:', err);}
        console.log('res1:', res1);
        run();
      });
    } else if (answer == 7){
      web3.eth.defaultAccount = web3.eth.accounts[1];
      var dvpContractInstance = getTokenInstance(dvpContract.abi, dvpContract.address);       
      dvpContractInstance.exchangeForValue(web3.eth.accounts[2]
        , 'trade123', asset2.address, asset1.address, 100, 100
        , {gas: 500000, gasPrice:1}, function(err, res1){
        if(err){console.log('ERROR:', err);}
        console.log('res1:', res1);
        run();
      });
    } else if (answer == 6){
      var asset1Instance = getTokenInstance(asset1.abi, asset1.address);       
      var account1Asset1Balance = asset1Instance.balanceOf(web3.eth.accounts[1]);
      var account2Asset1Balance = asset1Instance.balanceOf(web3.eth.accounts[2]);

      var asset2Instance = getTokenInstance(asset2.abi, asset2.address);       
      var account1Asset2Balance = asset2Instance.balanceOf(web3.eth.accounts[1]);
      var account2Asset2Balance = asset2Instance.balanceOf(web3.eth.accounts[2]);
      
      console.log('Account1: \nAsset1:', account1Asset1Balance.c[0], ' | Asset2:'
        , account1Asset2Balance.c[0]);
      console.log('Account2: \nAsset1:', account2Asset1Balance.c[0], ' | Asset2:'
        , account2Asset2Balance.c[0]);
      console.log('\n');
      run();
    } else if (answer == 5){
      web3.eth.defaultAccount = web3.eth.accounts[2];
      var asset1Instance = getTokenInstance(asset1.abi, asset1.address);       
      asset1Instance.authorise(dvpContract.address, {gas: 100000, gasPrice:1}, function(err, res1){
        if(err){console.log('ERROR:', err)}
        var asset2Instance = getTokenInstance(asset2.abi, asset2.address);       
        asset2Instance.authorise(dvpContract.address, {gas: 100000, gasPrice:1}, function(err, res2){
          if(err){console.log('ERROR:', err)}
          console.log('Account 2 authorized');
          run();
        });
      });
    } else if (answer == 4){
      web3.eth.defaultAccount = web3.eth.accounts[1];
      var asset1Instance = getTokenInstance(asset1.abi, asset1.address);       
      asset1Instance.authorise(dvpContract.address, {gas: 100000, gasPrice:1}, function(err, res1){
        if(err){console.log('ERROR:', err)}
        var asset2Instance = getTokenInstance(asset2.abi, asset2.address);       
        asset2Instance.authorise(dvpContract.address, {gas: 100000, gasPrice:1}, function(err, res2){
          if(err){console.log('ERROR:', err)}
          console.log('Account 1 authorized');
          run();
        });
      });
    } else if (answer == 3){
      submitDvPContract(function(res){
        dvpContract.address = res.contractAddress;
        dvpContract.abi = res.contractABI;
        var dvpContractInstance = getTokenInstance(dvpContract.abi, dvpContract.address);       
        dvpContractInstance.Error({}, function(err, res){
          if(err){console.log('ERROR:', err)}
          console.log('Contract error:', res);
        });
        dvpContractInstance.Committed({}, function(err, res){
          if(err){console.log('ERROR:', err)}
          console.log('Contract committed:', res);
        });
        dvpContractInstance.Settled({}, function(err, res){
          if(err){console.log('ERROR:', err)}
          console.log('Contract settlement:', res);
        });
        dvpContractInstance.Debug({}, function(err, res){
          if(err){console.log('ERROR:', err)}
          console.log('Contract Debug:', res);
        });
        run();
      });
    } else if (answer == 2){
      submitTokenContract('Asset2', 1000000, 'TOK2', web3.eth.accounts[2], function(res){
        asset2.address = res.contractAddress;
        asset2.abi = res.contractABI;
        run();
      });
    } else if (answer == 1){
      submitTokenContract('Asset1', 1000000, 'TOK1', web3.eth.accounts[1], function(res){
        asset1.address = res.contractAddress;
        asset1.abi = res.contractABI;
        run();
      });
    } else {
      run();
    }
  });
}
run();
