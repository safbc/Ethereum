import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { AppComponent }                 from './app.component';
import { LoginComponent }               from './login.component';
import { TransferComponent }            from './transfer.component';
import { TransactionDetailComponent }   from './transaction-detail.component';
import { TransactionsComponent }        from './transactions.component';
import { UserService }                  from './user.service';
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
    LoginComponent,
    TransferComponent,
    TransactionDetailComponent,
    TransactionsComponent
  ],
  providers: [ 
    TransactionService,
    UserService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
