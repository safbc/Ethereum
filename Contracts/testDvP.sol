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

contract Token {
  function hasAuth(address from) returns (bool);
  function canTransferEx(address _from, address _to, uint256 _value) returns (bool);
  function transferEx(address _from, address _to, uint256 _value);
}

contract DvP is owned {
  address public owner;
  bool public allowOperation = true;

  struct Commitment {
      address commitingParty;  /* Address of the counterparty to this trade */
      string tradeId;        /* Unique id of the trade being settled */
	    address acceptToken;   /* Address of the contract for the asset being purchased */
	    address deliverToken;  /* Address of the contract for the asset being sold */
	    uint256 acceptAmount;  /* Amount of the asset being purchased */
      uint256 deliverAmount; /* Amount of the asset being sold */
	 }

  /*
    Keep track of commitments to settle.  Contract will ensure that first
    request to settle will result in the creation of a commitment.
    The second request to settle will match details and if everything ties up,
    go ahead and settle.
  */
  mapping (address => mapping ( address => mapping (string => Commitment))) settlementCommitments;


  event Settled(address indexed from, address indexed to, string tradeId);
  event Committed(address indexed from, address indexed to, string tradeId);
  event Error(string error);
  event Debug(string debug);

  modifier onlyWhenOperationIsAllowed{
    if(allowOperation == false) throw;
    _;
  }

  function setAllowOperation(bool _allowOperation) onlyOwner{
    allowOperation = _allowOperation;
  }


  function exchangeForValue(address _counterparty, string _tradeId,
                            address _acceptToken, address _deliverToken,
                            uint256 _acceptAmount, uint256 _deliverAmount) onlyWhenOperationIsAllowed {
    Commitment commitment = settlementCommitments[msg.sender][_counterparty][_tradeId];

    if (commitment.commitingParty == 0) {
      Commitment memory memoryCommitment = Commitment(msg.sender,
                                                              _tradeId, _acceptToken,
                                                              _deliverToken, _acceptAmount,
                                                              _deliverAmount);
      settlementCommitments[_counterparty][msg.sender][_tradeId] = memoryCommitment;
      Committed(msg.sender, _counterparty, _tradeId);
    }
    else if ( commitment.commitingParty == _counterparty &&
              stringsEqual(commitment.tradeId, _tradeId) &&
              commitment.acceptToken == _deliverToken &&
              commitment.deliverToken == _acceptToken &&
              commitment.acceptAmount == _deliverAmount &&
              commitment.deliverAmount == _acceptAmount) {

      var acceptTok = Token(_acceptToken);
      var deliverTok = Token(_deliverToken);
   
      Debug('Going to test so that execution can happen'); 
     if(acceptTok.hasAuth(_counterparty) != true){
        Error('Counterparty does not have auth'); 
      } else {
        
        if(deliverTok.hasAuth(msg.sender) != true){
          Debug('msg.sender does not have auth'); 
        } else {
          if (acceptTok.canTransferEx(_counterparty, msg.sender, _acceptAmount) &&
              deliverTok.canTransferEx(msg.sender, _counterparty, _deliverAmount)) {
            
            acceptTok.transferEx(_counterparty, msg.sender, _acceptAmount);
            deliverTok.transferEx(msg.sender, _counterparty, _deliverAmount);
            Settled(_counterparty, msg.sender, _tradeId);
            delete settlementCommitments[msg.sender][_counterparty][_tradeId];
          }
          else {
            /*
              TODO Handle the situation in which settlement fails as a result of
                   one of the parties having insufficient balance
            */
            Error("Settlement failed as result of insufficient balance");
            /*throw;*/
          }
        }
      }
    }
    else {
      /*
        TODO Handle the situation in which settlement instructions don't agree
             on assets or amounts
      */
      /*throw; */
      Error("Settlement failed as result of insufficient balance");
    }
  }

  function () {
    throw;
  }

  function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
  		bytes storage a = bytes(_a);
  		bytes memory b = bytes(_b);
  		if (a.length != b.length)
  			return false;
  		// @todo unroll this loop
  		for (uint i = 0; i < a.length; i ++)
  			if (a[i] != b[i])
  				return false;
  		return true;
  }
}
