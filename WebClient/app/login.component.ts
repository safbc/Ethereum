import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'loginPage',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})

export class LoginComponent implements OnInit {

  user: User;
  userName: string;
  password: string;
  errMsg: string;
  randomQuote: string;

  constructor(
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUser()
      .then(user => this.user = user);
  }

  login(): void {
    this.userService.login(this.userName, this.password) 
			.subscribe(
				data => {
          if(data["err"] && data["err"] != ''){
            console.log('An error occured: ', data["err"]);
            this.errMsg = data["err"];
          } else {
            this.user.name = data["name"];
            this.user.isLoggedIn = true;
            this.user.address = data["address"];
          }
        },
				err => { this.errMsg = err.Message; }
			);
/**    this.callServer('login'); **/
  }

  register(): void {
    this.userService.register(this.userName, this.password) 
			.subscribe(
				data => {
          if(data["err"] && data["err"] != ''){
            console.log('An error occured: ', data["err"]);
            this.errMsg = data["err"];
          } else {
            this.user.name = data["name"];
            this.user.isLoggedIn = true;
            this.user.address = data["address"];
          }
        },
				err => { this.errMsg = err.Message; }
			);
    /**this.callServer('registerNewUser');**/
  }

  /**callServer(functionCall:string) {
    this.errMsg = "";
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({'userName' : this.userName, 'password' : this.password});
    this.http.post('http://localhost:3032/' + functionCall, body , options)
      .map(response => response.json())
			.subscribe(
				data => {
            this.response = data;
            console.log('response:', this.response);
            if(data["err"] && data["err"] != ''){
              console.log('An error occured: ', data["err"]);
              this.errMsg = data["err"];
            } else {
              this.user.name = data["name"];
              this.user.isLoggedIn = true;
              this.user.address = data["address"];
              console.log('user:', this.user);
            }
            },
				err => this.logError(err),
				() => console.log('User (Raw)', this.response)
			);
  }**/
}

