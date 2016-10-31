import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Transaction }         from './transaction';
import { TransactionService }  from './transaction.service';
@Component({
  moduleId: module.id,
  selector: 'my-transaction-detail',
  templateUrl: 'transaction-detail.component.html',
  styleUrls: [ 'transaction-detail.component.css' ]
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.transactionService.getTransaction(id)
        .then(transaction => this.transaction = transaction);
    });
  }

  goBack(): void {
    this.location.back();
  }
}

