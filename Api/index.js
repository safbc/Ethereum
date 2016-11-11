var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var accountManagement = require('../AccountManagement/accountManagement.js');
var etherDistribution = require('../EtherDistribution/etherDistribution.js');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

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

app.post('/registerNewUser', function(req, res){
  console.log('registerNewUser hit');
  console.log(req.body);      // your JSON
  if(req.body){
		res.json(req.body);    // echo the result back
  } else {
		res.json({'err': 'There was nothing in the body'});
  }
});

app.listen(3032, function () {
    console.log('Springblock API running on port 3032')
})
