import { User } from './user';
import { Injectable } from '@angular/core';


@Injectable()
export class UserService {
  getUser(): Promise<User> {
    return Promise.resolve({id: 11, name: 'Foundery', isLoggedIn: false});
  }

}
