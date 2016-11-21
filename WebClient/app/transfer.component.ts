import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Transaction } from './transaction';
import { TransactionService } from './transaction.service';

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'transfer.component.html',
  styleUrls: [ 'transfer.component.css' ]
})
export class TransferComponent implements OnInit {

  transactions: Transaction[] = [];

  constructor(
    private router: Router,
    private transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.contractService.getListOfContracts()
      .then(transactions => this.transactions = transactions.slice(1, 5));
  }

}

