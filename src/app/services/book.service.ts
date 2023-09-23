import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { environment } from 'src/environments/environment.development';

import { Status } from '../models/status';
import { Observable, of } from 'rxjs';
import { Statistic } from '../models/statistic';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = environment.baseUrl + '/book';

  constructor(private http: HttpClient) {

  }

  addUpdate(book: Book) {
    return this.http.post<Status>(this.baseUrl + '/addupdate', book);
  }

  getById(id: number) {
    return this.http.get<Book>(this.baseUrl + '/getbyid/' + id);
  }

  delete(id: number) {
    return this.http.delete<Status>(this.baseUrl + '/delete/' + id);
  }

  getall(term: string = ""): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl + `/getall?term=${term}`);
    //return this.http.get<Book[]>('assets/books.json');
  }

  getBookStatistic() {
    return this.http.get<Statistic[]>(this.baseUrl + `/getbookstatistic`)
  }

}
