var mongojs = require('mongojs')

var config = require('../config.js');
var db;

function logError(err){
  if(err){
    if(err.message == 'ns not found'){
      return;
    } else {
      console.log(err);
    }
  }
}

function connectToDB(cb){
  var dbConnection = mongojs(config.dbConnectionString, config.dbCollections);
  db = dbConnection;
  cb();
}

function checkForMatchingName(searchArray, name, arrayToUpdate, cb){
  var wordIndex=searchArray.indexOf(name);
	if(wordIndex>-1){
		searchArray.splice(wordIndex, 1);
    cb({'contractName': name});
	} else {
		arrayToUpdate.push(name);
		cb(null);
	}
}

function getListOfContracts(cb){
  if(!db){
    connectToDB(function(){
      getListOfContracts(function(res){
        cb(res);
      });
    });
  } else {
    db.contractRegistry.find({}, {"name": 1}, function(err, docs){
      logError(err);
      var contractNames = [];
      var contractNamesTemp = [];
      var contractNamesBalances = [];
      for(var index=0;index<docs.length;index++){
        var name = docs[index].name;
        if(name.indexOf("Balance")>-1){
          var cleanName = name.substring(0,name.indexOf("Balance"));
					checkForMatchingName(contractNamesTemp, cleanName, contractNamesBalances, function(newName){
						if(newName){
							contractNames.push(newName);
						}
					});
        } else {
					checkForMatchingName(contractNamesBalances, name, contractNamesTemp, function(newName){
						if(newName){
							contractNames.push(newName);
						}
					});
        }
      }
      cb(contractNames);
    });
  }
}

function getContract(contractName, contractVersion, cb){
  if(!db){
    connectToDB(function(){
      getContract(contractName, contractVersion, function(res){
        cb(res);
      });
    });
  } else {
    db.contractRegistry.findOne({name: contractName, version: contractVersion}, function(err, doc){
      logError(err);
      cb(doc);
    });
  }
}

function addContract(entry, cb){
  if(!db){
    connectToDB(function(){
      addContract(entry, function(res){
        cb(res);
      });
    });
  } else {
    db.contractRegistry.insert(entry, function(err, doc){
      logError(err);
      cb(doc);
    });
  }
}

/*function updateCryptoZAR(entry, cb){
  if(!db){
    connectToDB(function(){
      updateCryptoZAR(entry, function(res){
        cb(res);
      });
    });
  } else {
    db.cryptoZARRegistry.save(entry, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}*/

function closeDB(){
  if(db != null || db != undefined){
    db.close();
  }
}

exports.GetContract = getContract;
exports.AddContract =  addContract;
exports.GetListOfContracts =  getListOfContracts;
//exports.UpdateCryptoZAR =  updateCryptoZAR;
exports.CloseDB = closeDB;
