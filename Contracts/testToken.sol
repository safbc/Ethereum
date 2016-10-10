//pragma solidity ^0.4.2;

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

contract Token is owned {
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
  address public owner;

  bool public allowOperation = true;
  mapping (address => uint256) public balanceOf;

  /*
    Keep track of addresses that have been authorised to debit a TestToken account
  */
  mapping (address => mapping (address => bool)) authorisedDelegates;

  event Transfer(address indexed from, address indexed to, uint256 value);

  function Token(
    uint256 initialSupply,
    string tokenName,
    string symbol_,
    uint8 decimalUnits) {
      owner = msg.sender;
      balanceOf[owner] = initialSupply;
      totalSupply = initialSupply;
      name = tokenName;
      symbol = symbol_;
      decimals = decimalUnits;
  }

  modifier onlyWhenOperationIsAllowed{
    if(allowOperation == false) throw;
    _;
  }

  function setAllowOperation(bool _allowOperation) onlyOwner{
    allowOperation = _allowOperation;
  }

  /*
    This function enables the sender to authorise a contract to debit their
    tokenBalance.  This is to enable the DvP contract
  */
  function authorise(address _delegate) onlyWhenOperationIsAllowed {
    authorisedDelegates[msg.sender][_delegate] = true;
  }

  function removeAuthorisation(address _delegate) onlyWhenOperationIsAllowed {
    delete authorisedDelegates[msg.sender][_delegate];
  }

  function hasAuth(address _from) onlyWhenOperationIsAllowed returns (bool){
    if (!authorisedDelegates[_from][msg.sender] == true) {
      return false;
    } else {
      return true;
    }
  }

  function canTransferEx(address _from, address _to, uint256 _value) onlyWhenOperationIsAllowed returns (bool) {
    if (balanceOf[_from] < _value){
      return false;
    } else {
      return true;
    }
  }

  function transferEx(address _from, address _to, uint256 _value) onlyWhenOperationIsAllowed {
    if (!authorisedDelegates[_from][msg.sender] == true) throw;
    if (balanceOf[_from] < _value) throw;
    if (balanceOf[_to] + _value < balanceOf[_to]) throw;
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    Transfer(_from, _to, _value);
  }

  function transfer(address _to, uint256 _value) onlyWhenOperationIsAllowed {
    if (balanceOf[msg.sender] < _value) throw;
    if (balanceOf[_to] + _value < balanceOf[_to]) throw;
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    Transfer(msg.sender, _to, _value);
  }

  function adjustOwnerBalance(int _value) onlyOwner onlyWhenOperationIsAllowed{
    uint value = 0;
    if(_value > 0){
      value = uint(_value);
      if (balanceOf[owner] + value < 0) throw;
      balanceOf[owner] += value;
      totalSupply += value;
    } else {
      value = uint(-1 * _value);
      if (balanceOf[owner] - value < 0) throw;
      balanceOf[owner] -= value;
      totalSupply -= value;
    }
  }

  function () {
    throw;
  }
}
