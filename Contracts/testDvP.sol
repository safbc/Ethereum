//pragma solidity ^0.4.2;

import "testToken.sol";

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


  event Settled(address indexed from, address indexed to, uint256 value);
  event Committed(address indexed from, address indexed to, string tradeId);



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
      settlementCommitments[_counterparty][msg.sender][_tradeId] = Commitment(msg.sender,
                                                              _tradeId, _acceptToken,
                                                              _deliverToken, _acceptAmount,
                                                              _deliverAmount);
      Committed(msg.sender, _counterparty, _tradeId);
    }
    else if ( commitment.commitingParty == _counterparty &&
              stringsEqual(commitment.tradeId, _tradeId) &&
              commitment.acceptToken == _deliverToken &&
              commitment.deliverToken == _acceptToken &&
              commitment.acceptAmount == _deliverAmount &&
              commitment.deliverAmount == _acceptAmount) {
      if (Token(_acceptToken).canTransferEx(_counterparty, msg.sender, _acceptAmount) &&
          Token(_deliverToken).canTransferEx(msg.sender, _counterparty, _deliverAmount)) {
        Token(_acceptToken).transferEx(_counterparty, msg.sender, _acceptAmount);
        Token(_deliverToken).transferEx(msg.sender, _counterparty, _deliverAmount);
        delete settlementCommitments[msg.sender][_counterparty][_tradeId];
      }
      else {
        /*
          TODO Handle the situation in which settlement fails as a result of
               one of the parties having insufficient balance
        */
        throw;
      }
    }
    else {
      /*
        TODO Handle the situation in which settlement instructions don't agree
             on assets or amounts
      */
      throw;    /* Commitment found, but the details don't match*/
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
