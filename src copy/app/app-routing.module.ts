import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './components/add-book/add-book.component';
import { BooksComponent } from './components/books/books.component';

const routes: Routes = [
  { 'path': 'add-book', component: AddBookComponent },
  { 'path': 'update-book/:id', component: AddBookComponent },
  { 'path': 'books', component: BooksComponent },
  { 'path': '', redirectTo: '/books', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
