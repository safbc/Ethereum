pragma solidity ^0.4.2;

contract owned {
  address public owner;

  event TransferOwnership(address newOwner);

  function owned(){
    owner = msg.sender;
  }

  modifier onlyOwner{
    if(msg.sender != owner) throw;
    _;
  }

  function transferOwnership(address newOwner) onlyOwner {
    owner = newOwner;
    TransferOwnership(newOwner);
  }
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

contract Balance is owned, mutex {
  mapping (address => uint256) public balanceOf;

  event SetBalanceOf(address indexed addressToSet, uint indexed value);
  event AddToBalanceOf(address indexed _address, uint indexed value);
  event SubtractFromBalanceOf(address indexed _address, uint indexed value);
  event BalanceTransfer(address indexed fromAddress, address indexed toAddress, uint indexed value);

  function Balance(uint initialSupply) {
    balanceOf[owner] = initialSupply;
  }

  function setBalanceOf(address _address, uint _value) onlyOwner{
    balanceOf[_address] = _value;
    SetBalanceOf(_address, _value);
  }

  // Add overflow checks
  function addToBalanceOf(address _address, uint _value) onlyOwner{
    balanceOf[_address] += _value;
    AddToBalanceOf(_address, balanceOf[_address]);
  }

  // Add overflow checks
  function subtractFromBalanceOf(address _address, uint _value) onlyOwner{
    balanceOf[_address] -= _value;
    SubtractFromBalanceOf(_address, balanceOf[_address]);
  }

  function transfer(address fromAddress, address toAddress, uint _value) onlyOwner noReentrancy{
    if(balanceOf[fromAddress] < _value) { throw;}
    if(balanceOf[toAddress] + _value < balanceOf[toAddress]) { throw;}
    balanceOf[fromAddress] -= _value;
    balanceOf[toAddress] += _value;
    BalanceTransfer(fromAddress, toAddress, _value);
  }
}
