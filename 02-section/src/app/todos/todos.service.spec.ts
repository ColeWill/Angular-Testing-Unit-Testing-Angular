import { TestBed } from '@angular/core/testing';

import { TodosService } from './todos.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FilterEnum } from '../types/filter.enum';
import { TodoInterface } from '../types/todo.interface';

describe('TodosService', () => {
  let todosService: TodosService;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'http://localhost:3004/todos';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService],
    });
    todosService = TestBed.inject(TodosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('creates service', () => {
    expect(todosService).toBeTruthy();
  });

  // normally we don't test our data, but we are going to test
  // the three default values to know that they are there

  it('sets initial data', () => {
    expect(todosService.apiBaseUrl).toEqual(baseUrl);
    expect(todosService.todosSig()).toEqual([]);
    expect(todosService.filterSig()).toEqual(FilterEnum.all);
  });

  describe('changeFilter', () => {
    it('changes the filter', () => {
      todosService.changeFilter(FilterEnum.active);
      expect(todosService.filterSig()).toEqual(FilterEnum.active);
    });
  });
  describe('getTodos', () => {
    it('should return a list of todos', () => {
      // testing a angular signals http request
      let todos: TodoInterface[] | undefined;

      todosService.getTodos();
      const req = httpTestingController.expectOne(baseUrl);
      req.flush([{ text: 'foo', isCompleted: true, id: '1' }]);
      expect(todosService.todosSig()).toEqual([
        { text: 'foo', isCompleted: true, id: '1' },
      ]);
    });
  });

  describe('addTodos', () => {
    it('should add a todo', () => {
      let todos: TodoInterface[] | undefined;

      todosService.addTodo('foo');
      const req = httpTestingController.expectOne(baseUrl);
      req.flush({ text: 'foo', isCompleted: false, id: '3' });
      expect(todosService.todosSig()).toEqual([
        {
          text: 'foo',
          isCompleted: false,
          id: '3',
        },
      ]);
    });
  });

  describe('changeTodo', () => {
    it('should update a todo', () => {
      let todos: TodoInterface[] | undefined;
      todosService.todosSig.set([{ text: 'foo', isCompleted: true, id: '1' }]);
      todosService.changeTodo('1', 'bar');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({ text: 'bar', id: '1', isCompleted: true });
      expect(todosService.todosSig()).toEqual([
        { text: 'bar', id: '1', isCompleted: true },
      ]);
    });
  });
  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      let todos: TodoInterface[];
      todosService.todosSig.set([{ text: 'foo', isCompleted: false, id: '1' }]);
      todosService.removeTodo('1');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({});
      expect(todosService.todosSig()).toEqual([]);
    });
  });

  describe('toggleTodo', () => {
    it('should change is completed to true', () => {
      let todos: TodoInterface[];
      todosService.todosSig.set([{ text: 'foo', isCompleted: false, id: '1' }]);
      todosService.toggleTodo('1');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({ text: 'foo', isCompleted: true, id: '1' });
      expect(todosService.todosSig()).toEqual([
        {
          text: 'foo',
          isCompleted: true,
          id: '1',
        },
      ]);
    });
  });

  describe('toggleAll', () => {
    it('toggles all todos', () => {
      let todos: TodoInterface[];
      todosService.todosSig.set([
        { text: 'foo', isCompleted: false, id: '1' },
        { text: 'bar', isCompleted: false, id: '2' },
      ]);
      todosService.toggleAll(true);
      //want an array of requests not one since the function maps
      const reqs = httpTestingController.match(request =>
        request.url.includes(baseUrl)
      );
      reqs[0].flush({ text: 'foo', isCompleted: true, id: '1' });
      reqs[1].flush({ text: 'foo', isCompleted: true, id: '2' });

      expect(todosService.todosSig()).toEqual([
        { text: 'foo', isCompleted: true, id: '1' },
        { text: 'bar', isCompleted: true, id: '2' },
      ]);
    });
  });
});
