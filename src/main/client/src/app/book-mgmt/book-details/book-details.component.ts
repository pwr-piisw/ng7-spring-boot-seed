import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, NgForm} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Book, BookService} from '../book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  @ViewChild('bookForm') currentForm: NgForm;

  currentBook: Book;

  submitted: boolean;

  private static createErrorMessage(errorObject: {[key: string]: any}): string {
    if (errorObject) {
      for (const errorCode in errorObject) {
        if (errorObject.hasOwnProperty(errorCode)) {
          switch (errorCode) {
            case 'required':
              return 'Please provide a value';
            case 'maxlength':
              return 'The value is too long';
            default:
              return 'The value is wrong';
          }
        }
      }
    }
  };

  constructor(private bookService: BookService, private route: ActivatedRoute, private router: Router) {
    this.currentBook = new Book();
    this.submitted = false;
  }

  save(): void {
    this.submitted = true;
    if (this.currentForm && this.currentForm.form && this.currentForm.form.valid) {
      this.bookService.save(this.currentBook).subscribe(() => this.router.navigate(['/app/books']));
    }
  }

  delete() {
    this.bookService.delete(this.currentBook).subscribe(() => this.router.navigate(['/app/books']));
  }

  getErrorMessageOfField(fieldName: string): string {
    if (this.isFieldInvalid(fieldName)) {
      const fieldControl: AbstractControl = this.currentForm.form.get(fieldName);
      return BookDetailsComponent.createErrorMessage(fieldControl.errors);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const fieldControl: AbstractControl = this.currentForm.form.get(fieldName);
    return fieldControl && fieldControl.invalid && (fieldControl.touched || this.submitted);
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['bookId']) {
        const bookId: number = +params['bookId'];
        this.bookService.findOne(bookId).subscribe( book => {
          if (book) {
            this.currentBook = book;
          } else {
            this.router.navigate(['/app/book']);
          }
        });
      }
    });
  }
}
