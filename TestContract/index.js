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

function submitTokenContract(tokenName, numberOfTokens, cb){
  var tokenContractFilePath = __dirname + '/testToken.sol';
  fs.readFile(tokenContractFilePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
    web3.personal.unlockAccount(web3.eth.coinbase, "1234", 3600, function(err, res){
      if(err){console.log("ERROR:", err);}
      web3.eth.defaultAccount = web3.eth.coinbase;
      var compiled = web3.eth.compile.solidity(source);
      var code = compiled.Token.code;
      var abi = compiled.Token.info.abiDefinition;

      web3.eth.contract(abi).new(numberOfTokens, tokenName, {data: code, gas: 1000000, gasPrice: 1}, function (err, contract) { // Note that this callback is called twice
        if(err) {
          console.error("ERROR:", err); 	// Log any errors
          cb();
        } else if(contract.address){	// If this contract has an address it means that it has been mined and included into the blockchain
          console.log('Contract mined, address: ' + contract.address);
          cb({
            tokenName: tokenName,
            contractAddress: contract.address,
            contractSource: source
          });
        }
      });
    });
  });
}

function getTokenInstance(contractSource, contractAddress){
  var compiled = web3.eth.compile.solidity(contractSource);
  var abi = compiled.Token.info.abiDefinition;
  var tokenContract_ = web3.eth.contract(abi);
  var token = tokenContract_.at(contractAddress);
  return token;
}

var contractAddress = null;
var contractSource = null;

function run(){
  rl.question('What would you like to do: '+
    '\n1) Get a block:'+
    '\n2) Deploy test contract:'+
    '\n3) Check balance:'+
    '\n4) Send token:'+
    '\n5) Set token address:'+
    '\n0) Quit'+
    '\n> ', function(answer){
    if(answer == 0){
      console.log('Quiting');
      rl.close();
      return;
    } else if (answer == 5){       
      rl.question('Address of contract: ', function(newContractAddress){
     	contractAddress = newContractAddress; 
        var tokenContractFilePath = __dirname + '/testToken.sol';
        fs.readFile(tokenContractFilePath, 'utf8', function(err, source){
          contractSource = source;
	  run();
	});
      });
    } else if (answer == 4){ 
      if(!contractAddress || !contractSource){
        console.log('First deploy a new contract!');
      } else {
        var token = getTokenInstance(contractSource, contractAddress);
        rl.question('Address of Receiver: ', function(receiver){
          rl.question('Quantity: ', function(quantity){
            web3.eth.defaultAccount = web3.eth.coinbase;
            token.transfer(receiver, quantity, {gas: 100000, gasPrice: 1}, function(res){
              var balance = token.balanceOf(receiver);
              console.log('Receiver\'s new balance', Number(balance.c[0]));
              run();  
            });
          });
        });
      }
    } else if (answer == 3){
      if(!contractAddress || !contractSource){
        console.log('First deploy a new contract!');
        run();
      } else {
        var token = getTokenInstance(contractSource, contractAddress);
        rl.question('Address: ', function(address){
          var balance = token.balanceOf(address);
          console.log('Balance:', Number(balance.c[0]));
          run();
        });
      }
    } else if (answer == 2){
      submitTokenContract('testToken', 100, function(res){
        contractAddress = res.contractAddress;
        contractSource = res.contractSource;
        run();
      });
    } else if (answer == 1){
      getBlockNumberFromTerminal(rl, function(blockNumber){
        getBlockByBlockNumber(blockNumber, function(block){
          console.log('Block:', block);
          run();
        });
      });
    } else {
      run();
    }
  });
}
run();
