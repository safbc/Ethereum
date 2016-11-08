import { User } from './user';
import { Injectable } from '@angular/core';

var accountManagement = require('../AccountManagement/accountManagement');
var etherDistribution = require('../EtherDistribution/etherDistribution');

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
    var nameAndPassword = {
        name: name, 
        password: password
      };

    accountManagement.HandleUserRegistration(nameAndPassword, function(newUser:any){
      if(newUser){
        this.user.name = username;
        this.user.address = newUser.address;
        this.user.isLoggedIn = true;
        etherDistribution.AddAccountToWatch(this.user.address, function(res:any){
          return Promise.resolve(this.user);
        });
      } else {
        throw new Error('\nUsername already taken. Please try again.\n');
      }
    });      

    throw new Error('\nSomething went badly wrong in the register method - we shouldnt be here\n');
  }
}
