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

contract TestCoin is owned {
  string public name;
  uint256 public totalSupply;
  address public owner;

  bool public allowOperation = true;
  mapping (address => uint256) public balanceOf;

  event Transfer(address indexed from, address indexed to, uint256 value);

  function TestCoin(
    uint256 initialSupply,
    string tokenName) {
      owner = msg.sender;
      balanceOf[owner] = initialSupply;
      totalSupply = initialSupply;
      name = tokenName;
  }

  modifier onlyWhenOperationIsAllowed{
    if(allowOperation == false) throw;
    _
  }

  function setAllowOperation(bool _allowOperation) onlyOwner{
    allowOperation = _allowOperation;
    // TODO publish event when contract operation is stopped/paused
  }

  function transfer(address _to, uint256 _value) onlyWhenOperationIsAllowed {
    // TODO check that this transfer transaction was mined by a valid miner
    if (balanceOf[msg.sender] < _value) throw;
    if (balanceOf[_to] + _value < balanceOf[_to]) throw;
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    Transfer(msg.sender, _to, _value);
  }

  function adjustOwnerBalance(uint256 _value) onlyOwner onlyWhenOperationIsAllowed{
    if (balanceOf[owner] + _value < 0) throw;
    balanceOf[owner] += _value;
    totalSupply += _value;
  }

  function () {
    throw;
  }
}

