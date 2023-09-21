import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Book} from 'src/app/models/book';
import {BookService} from 'src/app/services/book.service';
import {BehaviorSubject, Subject, switchMap, tap} from 'rxjs';

/*import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';*/

export interface Sort {
  sort: keyof Book;
  desk: boolean;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {

  displayedColumns: string[] = ['title', 'createdAt', 'pageCount'];

  books!: Book[];
  search$ = new BehaviorSubject<string>('');
  sort$ = new BehaviorSubject<Sort | null>(null);
  bookWithSearch$ = this.search$.pipe(switchMap(
    text => this.booksService.getall(text).pipe(tap(data => data.sort((a: Book, b: Book) => {
      const sort = this.sort$.value;
      if(sort) {
        return +a[sort.sort] - +b[sort.sort];
      }
      /*switch (this.sort$.value?.sort) {
        case 'title':
          break;
        case 'pageCount':
          break;
        case 'createdAt':
          break;
      }*/
      return 0;
    })))));

  constructor(private booksService: BookService,
              private router: Router) {

  }


  private getBooks(term: string = "") {

  }

  search(term: string) {
    this.getBooks(term);
  }

  delete(id: number, index: number): void {
    if (window.confirm("Are you sure to delete?")) {
      this.booksService.delete(id).subscribe({
        next: (res: { statusCode: number; message: any; }) => {
          if (res.statusCode == 1) {
            this.books.splice(index, 1);
          } else {
            console.log(res.message);
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  edit(id: number): void {
    this.router.navigate([`update-book/${id}`]);
  }


  ngOnInit(): void {
    this.getBooks();
  }

  //dataSource = new MatTableDataSource(this.books);

  //@ViewChild(MatSort) sort!: MatSort;

  /*ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }*/

  /*announceSortChange(sortState: any) {
    if (sortState.active && sortState.direction) {
      this._liveAnnouncer.announce(`Sorted by ${sortState.active} in ${sortState.direction}ending order`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }*/
}
