import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Transaction } from './transaction';
import { TransactionService } from './transaction.service';

@Component({
  moduleId: module.id,
  selector: 'recent-transactions',
  templateUrl: 'transactions.component.html',
  styleUrls: [ 'transactions.component.css' ]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[];
  selectedTransaction: Transaction;

  constructor(
    private router: Router,
    private transactionService: TransactionService) { }

  getTransactions(): void {
    this.transactionService.getTransactions().then(transactions => this.transactions = transactions);
  }

  ngOnInit(): void {
    this.getTransactions();
  }

  onSelect(transaction: Transaction): void {
    this.selectedTransaction = transaction;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedTransaction.id]);
  }
}

