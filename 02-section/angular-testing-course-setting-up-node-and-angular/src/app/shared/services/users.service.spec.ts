import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { UserInterface } from '../types/user';
import { UtilsService } from './utils.service';

describe('UserService', () => {
  let usersService: UsersService;
  let utilsService: UtilsService;
  // const utilsServiceMock = {
  //   pluck: jest.fn(), // mocks the service
  // };
  beforeEach(() => {
    TestBed.configureTestingModule({
      // this is like an NgModule
      providers: [
        UsersService,
        // { provide: UtilsService, useValue: utilsServiceMock },
        UtilsService,
      ],
    });

    usersService = TestBed.inject(UsersService);
    utilsService = TestBed.inject(UtilsService);
  });

  it('creates a service', () => {
    expect(usersService).toBeTruthy();
  });

  describe('addUser', () => {
    // we don't test for values, we test for functionality
    // so we don't test to see if the users[] has data,
    // we test to see if the addUsers function is working right
    it('should add a user', () => {
      const user: UserInterface = {
        id: '3',
        name: 'foo',
      };
      usersService.addUser(user);
      expect(usersService.users).toEqual([{ id: '3', name: 'foo' }]);
    });

    describe('removeUser', () => {
      it('should remove a user', () => {
        usersService.users = [
          {
            id: '3',
            name: 'foo',
          },
        ];
        usersService.removeUser('3');
        expect(usersService.users).toEqual([]);
      });
    });

    describe('getUsernames', () => {
      it('should get usernames', () => {
        // Mock a functions return value
        // this will return a value from an external service, without calling
        // the actual function from the service
        // utilsServiceMock.pluck.mockReturnValue(['foo']);
        // expect(usersService.getUsernames()).toEqual(['foo']);

        // SpyOn a real function and see what it returns
        // this is the REAL service we are calling
        jest.spyOn(utilsService, 'pluck');
        usersService.users = [{ id: '3', name: 'foo' }];
        usersService.getUsernames();
        expect(utilsService.pluck).toHaveBeenCalledWith(
          usersService.users,
          'name'
        );
      });
    });
  });
});
