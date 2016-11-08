import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a routerLink="/login" routerLinkActive="active">Login</a>
      <a routerLink="/transfer" routerLinkActive="active">Transfer</a>
      <a routerLink="/transactions" routerLinkActive="active">Transactions</a>
      <a routerLink="/issue" routerLinkActive="active">Issue Asset</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  title = 'Springblock Transaction Viewer';
}


