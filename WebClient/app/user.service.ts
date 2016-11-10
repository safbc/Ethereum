import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable()
export class UserService {

  user: User;

  getUser(): Promise<User> {
    if(!this.user){
      this.user=new User();
      this.user.name = '';
      this.user.isLoggedIn = false;
    }

    return Promise.resolve(this.user);
  }

  login(username:string , password:string): Promise<User> {
    this.user.name = username;
    this.user.isLoggedIn = true;
    return Promise.resolve(this.user);
  }

  register(username:string , password:string): Promise<User> {
    this.user.name = username;
    this.user.isLoggedIn = true;
    return Promise.resolve(this.user);
    
  }
}
