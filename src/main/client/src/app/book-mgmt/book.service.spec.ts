import {inject, TestBed} from '@angular/core/testing';
import {Book, BookService} from './book.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('BookService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService]
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it('should find all books',
    inject([HttpTestingController, BookService], (backend: HttpTestingController, service: BookService) => {

      const mockData = [{id: 1000, author: 'John Example 1', title: 'By Example 1'}];

      service.findAll().subscribe(foundBooks => {
        expect(foundBooks.length).toBe(mockData.length);
        expect(foundBooks[0].id).toBe(mockData[0].id);
        expect(foundBooks[0].author).toBe(mockData[0].author);
        expect(foundBooks[0].title).toBe(mockData[0].title);
      });

      const resp = backend.expectOne('services/rest/books');
      expect(resp.request.method).toEqual('GET');
      resp.flush(mockData);
    })
  );

  it('should save a book',
    inject([HttpTestingController, BookService], (backend: HttpTestingController, service: BookService) => {
      // given
      const book: Book = {author: 'John Example 2', title: 'By Example 2'};
      const mocked: Book = Object.assign({id: 1001}, book);
      // when
      service.save(book).subscribe(saved => {
        expect(saved).toEqual(mocked);
      });
      // then
      const resp = backend.expectOne('services/rest/books');
      expect(resp.request.method).toEqual('POST');
      expect(resp.request.body).toEqual(book);
      resp.flush(mocked);
    })
  );

  it('should find a book',
    inject([HttpTestingController, BookService], (backend: HttpTestingController, service: BookService) => {
      // given
      const book: Book = {id: 1002, author: 'John Example 2', title: 'By Example 2'};
      // when
      service.findOne(book.id).subscribe(foundBook => {
        // then
        expect(foundBook).toEqual(book);
      });
      // then
      const resp = backend.expectOne('services/rest/books/' + book.id);
      expect(resp.request.method).toEqual('GET');
      resp.flush(book);
    })
  );

  it('should delete a book',
    inject([HttpTestingController, BookService], (backend: HttpTestingController, service: BookService) => {
      //given
      const book: Book = {id: 1003, author: 'John Example 3', title: 'By Example 3'};
      //when
      service.delete(book).subscribe(
        (response) => {
          expect(response.status).toEqual(200);
        }
      );
      // then
      const resp = backend.expectOne('services/rest/books/' + book.id);
      expect(resp.request.method).toEqual('DELETE');
      resp.flush('', {status: 200, statusText: 'OK'});
    })
  );
});
