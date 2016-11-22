import { NgModule }                     from '@angular/core';
import { BrowserModule }                from '@angular/platform-browser';
import { FormsModule }                  from '@angular/forms';
import { HttpModule }                   from '@angular/http';

import { AppComponent }                 from './app.component';
import { LoginComponent }               from './login.component';
import { TransferComponent }            from './transfer.component';
import { IssueComponent }               from './issue.component';
import { TransactionDetailComponent }   from './transaction-detail.component';
import { TransactionsComponent }        from './transactions.component';
import { UserService }                  from './user.service';
import { AssetService }                 from './asset.service';
import { TransactionService }           from './transaction.service';
import { TypeaheadModule }              from 'ng2-bootstrap/ng2-bootstrap';

import { AppRoutingModule }             from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    TypeaheadModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    TransferComponent,
    IssueComponent,
    TransactionDetailComponent,
    TransactionsComponent
  ],
  providers: [ 
    TransactionService,
    UserService,
    AssetService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
