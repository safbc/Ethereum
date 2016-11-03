var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

function submitContract(ownerAddress, initialSupply, cb){
  var rootDirectory = __dirname.replace("Issuance", "");
  var filePath = rootDirectory + 'Contracts/balanceContract.sol';
  fs.readFile(filePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
    web3.eth.defaultAccount = ownerAddress;
    var compiled = web3.eth.compile.solidity(source);
    var code = compiled.Balance.code;
    var abi = compiled.Balance.info.abiDefinition;

    var contractData = web3.eth.contract(abi).new.getData({data: code});
    var estimatedGas = web3.eth.estimateGas({data: contractData});

    web3.eth.contract(abi).new(initialSupply, {data: code, gas: estimatedGas+2*30000, gasPrice: 1}
        , function (err, contract) { 
      if(err) {
        console.error("ERROR:", err);   // Log any errors
        cb();
      } else if(contract.address){  
        console.log('Contract mined, address: ' + contract.address);
        cb({
          contractAddress: contract.address,
          contractSource: source,
          contractABI: abi
        });
      }
    });
  });
}

exports.SubmitContract = submitContract;
