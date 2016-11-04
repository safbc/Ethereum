pragma solidity ^0.4.2;

contract owned {
  address public owner;

  function owned(){
    owner = msg.sender;
  }

  modifier onlyOwner{
    if(msg.sender != owner) throw;
    _;
  }

  function transferOwnership(address newOwner) onlyOwner {
    owner = newOwner;
  }
}

contract Balance {
  mapping (address => uint256) public balanceOf;
  function setBalanceOf(address _address, uint _value);
  function addToBalanceOf(address _address, uint _value);
  function subtractFromBalanceOf(address _address, uint _value);
  function transfer(address _from, address _to, uint _value);
  function transferOwnership(address newOwner);
}

contract Asset {
  function DVP(uint256 _value);
}

contract mutex {
  bool locked;
  modifier noReentrancy() {
    if (locked) throw;
    locked = true;
    _;
    locked = false;
  }
}

contract Token is owned {
  address public balanceContractAddress;
  Balance balance;

  bool public allowOperation = true;

  event Transfer(address indexed from, address indexed to, uint256 value);

  function Token(address _balanceContractAddress) {
    balanceContractAddress = _balanceContractAddress;
    balance = Balance(balanceContractAddress);
  }

  modifier onlyWhenOperationIsAllowed{
    if(allowOperation == false) throw;
    _;
  }

  function setAllowOperation(bool _allowOperation) onlyOwner{
    allowOperation = _allowOperation;
  }

  function setBalanceContractAddress(address _address) onlyOwner{
    balanceContractAddress = _address;
    balance = Balance(balanceContractAddress);
  }

  function transferBalanceContractOwnership(address _address) onlyOwner {
    balance.transferOwnership(_address);
  }

  function transfer(address _to, uint256 _value) {
    balance.transfer(msg.sender, _to, _value);
    Transfer(msg.sender, _to, _value);
  }

  bool public inDVPTransfer = false;
  function DVPTransfer(address _to, uint256 _value) onlyWhenOperationIsAllowed {    
    if(!inDVPTransfer){
      inDVPTransfer = true;      
      transfer(_to, _value);
      Asset asset = Asset(_to);
      asset.DVP(_value);
      inDVPTransfer = false;
    }
  }

  function adjustOwnerBalance(int _value) onlyOwner onlyWhenOperationIsAllowed{
    uint value = 0;
    if(_value > 0){
      value = uint(_value);
      balance.addToBalanceOf(owner, value); 
    } else {
      value = uint(-1 * _value);
      balance.subtractFromBalanceOf(owner, value);
    }
  }

  function () {
    throw;
  }
}
