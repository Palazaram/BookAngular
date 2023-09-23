import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';
import { BehaviorSubject, map, Subject, switchMap, tap } from 'rxjs';
import * as moment from 'moment';
import { Chart, ChartConfiguration } from 'chart.js';


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

  books!: Book[];
  search$ = new BehaviorSubject<string>('');
  filterStartDate$ = new BehaviorSubject<string>('');
  filterEndDate$ = new BehaviorSubject<string>('');
  sort$ = new BehaviorSubject<Sort | null>(null);

  chart: Chart | null = null;

  public books$ = this.search$.pipe(
    switchMap(text => this.booksService.getall(text).pipe(
      //tap(books => this.updateCharData(books)),
      switchMap(books => this.filterStartDate$.pipe(map(start => books
        .filter(book => !start || moment(book.createdAt).diff(moment(start), 'day') >= 0)),
        switchMap(books => this.filterEndDate$.pipe(map(end => books
          .filter(book => !end || moment(book.createdAt).diff(moment(end), 'day') <= 0)),
          switchMap(books => this.sort$.pipe(map(sort => this.sort(books, sort))))))
      ))
    )
    )
  );

  public selectedBookId: number | null = null;

  constructor(private booksService: BookService,
    private router: Router) {

  }

  setSort(value: keyof Book): void {
    let current = this.sort$.value;
    if (value === current?.sort) {
      current.desk = !current.desk;
    } else {
      current = {
        sort: value,
        desk: false
      };
    }
    this.sort$.next(current);
  }

  protected sort(books: Book[], sort: Sort | null): Book[] {
    if (sort) {
      const direction = sort.desk ? 1 : -1;
      return books.sort((a: Book, b: Book) => {
        let result = 0;
        switch (sort.sort) {
          case 'title':
            result = a.title.localeCompare(b.title);
            break;
          case 'pageCount':
            result = a.pageCount - b.pageCount;
            break;
          case 'createdAt':
            result = moment(a.createdAt).diff(moment(b.createdAt), 'day');
            break;
        }
        return result * direction;
      });
    } else {
      return books;
    }
  }

  setThisMonth(): void {
    this.filterStartDate$.next(moment().startOf('months').format('yyyy-MM-DD'));
    this.filterEndDate$.next(moment().endOf('months').format('yyyy-MM-DD'));
  }

  setThisYear(): void {
    this.filterStartDate$.next(moment().startOf('year').format('yyyy-MM-DD'));
    this.filterEndDate$.next(moment().endOf('year').format('yyyy-MM-DD'));
  }

  updateRange(event: any) {
    if (event.target.id === 'start') {
      this.filterStartDate$.next(event.target.value);
    }
    if (event.target.id === 'end') {
      this.filterEndDate$.next(event.target.value);
    }


  }


  delete(id: number, index: number): void {
    if (window.confirm("Are you sure to delete?")) {
      this.booksService.delete(id).subscribe(() => {
        this.search$.next(this.search$.value);
        this.booksService.getBookStatistic().subscribe(data => {
          const chartData = data.map(stat => ({
            year: stat.year,
            amount: stat.bookCount
          }));
          console.log(chartData);
          this.updateChartDataAndChart(chartData);
        });
      });
    }
  }

  edit(id: number): void {
    this.router.navigate([`update-book/${id}`]);
  }

  ngOnInit(): void {
    this.booksService.getBookStatistic().subscribe(data => {
      const chartData = data.map(stat => ({
        year: stat.year,
        amount: stat.bookCount
      }));
      this.updateChartDataAndChart(chartData);
    });
  }

  updateCharData(data: { year: string, amount: number }[]): void {
    this.barChartData.labels = data.map(el => el.year);
    this.barChartData.datasets = [{ data: data.map(el => el.amount), label: 'Book mount' }];
  }

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  createChart(): void {
    const ctx = document.getElementById('ChartId') as HTMLCanvasElement;

    if (this.chart != null) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: this.barChartData,
      options: this.barChartOptions
    });
  }

  updateChartDataAndChart(data: { year: string, amount: number }[]): void {
    this.updateCharData(data);
    this.createChart();
  }


  reset() {
    this.filterStartDate$.next('');
    this.filterEndDate$.next('');
  }
}
