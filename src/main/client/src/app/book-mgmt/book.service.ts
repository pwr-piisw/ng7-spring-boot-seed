import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class BookService {

  constructor(private httpClient: HttpClient) {
  }

  findOne(id: number): Observable<Book> {
    return this.httpClient.get<Book>('services/rest/books/' + id);
  }

  save(bookToSave: Book): Observable<Book> {
    return this.httpClient.post<Book>('services/rest/books', bookToSave);
  }

  delete(bookToDelete: Book): Observable<HttpResponse<any>> {
    return this.httpClient.delete('services/rest/books/' + bookToDelete.id, {observe: 'response'});
  }

  findAll(): Observable<Book[]> {
    return this.httpClient.get<Book[]>('services/rest/books');
  }
}

export class Book {
  id?: number;
  author: string;
  title: string;

  static from(anotherBook: Book): Book {
    return {
      id: anotherBook.id,
      author: anotherBook.author,
      title: anotherBook.title
    }
  }
}
