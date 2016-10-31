import { Transaction } from './transaction';
import { TRANSACTIONS } from './mock-transactions';
import { Injectable } from '@angular/core';

@Injectable()
export class TransactionService {
  getTransactions(): Promise<Transaction[]> {
    return Promise.resolve(TRANSACTIONS);
  }

  getTransaction(id: number): Promise<Transaction> {
    return this.getTransactions()
               .then(transactions => transactions.find(transaction => transaction.id === id));
  }
}
