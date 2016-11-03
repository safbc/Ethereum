var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

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
