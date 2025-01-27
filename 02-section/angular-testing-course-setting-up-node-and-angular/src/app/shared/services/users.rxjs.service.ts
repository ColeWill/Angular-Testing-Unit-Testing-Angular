import { UserInterface } from './../types/user';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users: UserInterface[] = [];
  // reactive state, a stream of data that we subscribe to
  users$ = new BehaviorSubject<UserInterface[]>([]);

  addUser(user: UserInterface): void {
    this.users$.next([...this.users$.getValue(), user]);
  }

  removeUser(userId: string): void {
    const updatedUsers = this.users$
      .getValue()
      .filter(user => userId !== user.id);
    this.users$.next(updatedUsers);
  }
}
