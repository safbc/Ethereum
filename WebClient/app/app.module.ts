import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { AppComponent }                 from './app.component';
import { TransferComponent }            from './transfer.component';
import { TransactionDetailComponent }   from './transaction-detail.component';
import { TransactionsComponent }        from './transactions.component';
import { TransactionService }           from './transaction.service';

import { AppRoutingModule }             from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    TransferComponent,
    TransactionDetailComponent,
    TransactionsComponent
  ],
  providers: [ TransactionService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
