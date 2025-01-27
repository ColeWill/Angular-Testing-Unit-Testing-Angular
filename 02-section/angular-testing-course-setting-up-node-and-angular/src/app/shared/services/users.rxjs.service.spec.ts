import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.rxjs.service';
import { UserInterface } from '../types/user';

describe('UserService', () => {
  let usersService: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // this is like an NgModule
      providers: [UsersService],
    });

    usersService = TestBed.inject(UsersService);
  });

  it('creates a service', () => {
    expect(usersService).toBeTruthy();
  });

  describe('addUser', () => {
    // we don't test for values, we test for functionality
    // so we don't test to see if the users[] has data,
    // we test to see if the addUsers function is working right
    it('should add a user', () => {
      usersService.addUser({ id: '3', name: 'foo' });
      expect(usersService.users$.getValue()).toEqual([
        { id: '3', name: 'foo' },
      ]);
    });

    describe('removeUser', () => {
      it('should remove a user', () => {
        usersService.users$.next([
          {
            id: '3',
            name: 'foo',
          },
        ]);
        usersService.removeUser('3');
        expect(usersService.users$.getValue()).toEqual([]);
      });
    });
  });
});
