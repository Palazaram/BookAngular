import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Status } from 'src/app/models/status';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  frm!: FormGroup;

  status!: Status;

  constructor(private fb: FormBuilder, private bookService: BookService, route: ActivatedRoute) {
    const id = route.snapshot.params['id'];
    if (id) {
      bookService.getById(id).subscribe({
        next: (res) => {
          this.frm.patchValue(res);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }

  }

  get f() {
    return this.frm.controls; // for validation
  }


  onPost() {
    this.status = { statusCode: 0, message: 'wait..' }
    this.bookService.addUpdate(this.frm.value).subscribe({
      next: (res) => {
        this.status = res;
        if (this.status.statusCode == 1) {
          this.frm.reset();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  /*-------------------------------------------------*/
  ngOnInit(): void {
    this.frm = this.fb.group({
      'id': [0],
      'title': ['', Validators.required],
      'createdAt': ['', Validators.required],
      'description': ['', Validators.required],
      'pageCount': ['', Validators.required]
    })
  }

}
