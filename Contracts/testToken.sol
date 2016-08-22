contract owned {
  address public owner;

  function owned(){
    owner = msg.sender;
  }

  modifier onlyOwner{
    if(msg.sender != owner) throw;
    _
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
    _
  }

  function setAllowOperation(bool _allowOperation) onlyOwner{
    allowOperation = _allowOperation;
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
