var express = require('express')
var app = express()
var accountManagement = require('../AccountManagement/accountManagement.js');
var etherDistribution = require('../EtherDistribution/etherDistribution.js');

app.get('/login', function (req, res) {
  var userName = 'peter';
  var password = '12345';
  accountManagement.Login(userName, password, function(user){
    if(user){
      loggedInUser = user; 
        etherDistribution.AddAccountToWatch(loggedInUser.address, function(res){
          res.json({'msg': 'user logged in and account topped up with ether'});
        });
    } else {
      res.json({'err': 'invalid username or password'});
    }
  }); 
})

app.listen(3032, function () {
    console.log('Springblock API running on port 3032')
})
