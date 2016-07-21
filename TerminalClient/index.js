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
  var rootDirectory = __dirname.replace("TerminalClient", "");
  var tokenContractFilePath = rootDirectory + '/Contracts/testCoin.sol';
  fs.readFile(tokenContractFilePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
    web3.personal.unlockAccount(web3.eth.coinbase, "1234", 60*60, function(err, res){
      if(err){console.log("ERROR:", err);}
      web3.eth.defaultAccount = web3.eth.coinbase;
      var compiled = web3.eth.compile.solidity(source);
      var code = compiled.TestCoin.code;
      var abi = compiled.TestCoin.info.abiDefinition;

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
  var abi = compiled.TestCoin.info.abiDefinition;
  var tokenContract_ = web3.eth.contract(abi);
  var token = tokenContract_.at(contractAddress);
  return token;
}

var contractAddress = null;
var contractSource = null;

function run(){
  rl.question('What would you like to do: '+
    '\n1) Get a block:'+
    '\n2) Deploy TestCoin contract:'+
    '\n3) Check balance:'+
    '\n4) Send TestCoin:'+
    '\n0) Quit'+
    '\n> ', function(answer){
    if(answer == 0){
      console.log('Quiting');
      rl.close();
      return;
    } else if (answer == 4){
      if(!contractAddress || !contractSource){
        console.log('First deploy a new contract!');
        run();
      } else {
        rl.question('To Address: ', function(toAddress){
          rl.question('From Address: ', function(fromAddress){
            rl.question('Amount: ', function(amount){              
              web3.eth.defaultAccount = fromAddress;
              var token = getTokenInstance(contractSource, contractAddress);
              token.transfer(toAddress, amount, function(err, res){
                if(err) {console.log('ERROR:', err)}
                console.log(res);
                run();
              });
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
      submitTokenContract('TestCoin', 100, function(res){
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
