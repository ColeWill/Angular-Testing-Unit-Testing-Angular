import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TagInterface } from '../types/tags';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    // We don't to make ANY real API calls
    // We want to test our code in isolation
    // So de dont want to call APIs
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // makes sure the httpcontroller has no hanging mock api calls 'open results'
  // in every test we will need to mock a call,
  // the .verify() method checks for this
  afterEach(() => {
    httpTestingController.verify();
  });

  it('Creates Api Service', () => {
    expect(apiService).toBeTruthy();
  });

  describe('getTags', () => {
    it('should return a list of tags', () => {
      // this is async
      let tags: TagInterface[] | undefined;

      apiService.getTags().subscribe(response => {
        tags = response;
      });
      // this mocks the api call
      const req = httpTestingController.expectOne('http://localhost:3004/tags');
      req.flush([{ id: '1', name: 'foo' }]);
      expect(tags).toEqual([{ id: '1', name: 'foo' }]);
    });
  });

  describe('create tag function', () => {
    it('should create a tag', () => {
      let tag: TagInterface | undefined;
      apiService.createTag('foo').subscribe(res => {
        tag = res;
      });
      const req = httpTestingController.expectOne('http://localhost:3004/tags');
      req.flush({ id: '1', name: 'foo' });
      expect(tag).toEqual({ id: '1', name: 'foo' });
    });
    it('passes the correct body', () => {
      let tag: TagInterface | undefined;
      apiService.createTag('foo').subscribe(response => {
        tag = response;
      });
      const req = httpTestingController.expectOne('http://localhost:3004/tags');
      req.flush({ id: '1', name: 'foo' });
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ name: 'foo' });
    });

    it('throws an error if request fails', () => {
      let actualError: HttpErrorResponse | undefined;
      apiService.createTag('foo').subscribe({
        next: () => {
          // this should not be called since we want it to fail
          fail('Success should not be called'); // forbidding the test to pass
        },
        error: err => {
          actualError = err;
        },
      });

      const req = httpTestingController.expectOne('http://localhost:3004/tags');
      req.flush('Server error', {
        status: 422,
        statusText: 'Unprocessible Entity',
      });

      if (!actualError) {
        throw new Error('Error needs to be defined');
      }

      expect(actualError.status).toEqual(422);
      expect(actualError.statusText).toEqual('Unprocessible Entity');
    });
  });
});
