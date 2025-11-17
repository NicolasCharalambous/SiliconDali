import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBookService } from '../../library.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormAction } from '../../../../enums/form-action.enum';
import { FormType } from '../../../../enums/form-types.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFieldComponent } from '../../../../shared/base-field/base-field.component';
import { IBook, IBookParams } from '../../../../models/library';
import { catchError, finalize, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseFieldComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  readonly formType: FormType;
  _bookId: string = "";
  form!: FormGroup;
  isSaving: boolean = false;
  isLoading = signal(false);

  constructor(private _iBookService: IBookService, private _notification: NotificationService, private _activatedRoute: ActivatedRoute, private _formBuilder: FormBuilder, private _router: Router) {
    const [{path}] = this._activatedRoute.snapshot.url;

    if (path == FormAction.Add) {
      this.formType = FormType.NewBook
    } else {
      this.formType = FormType.ExistingBook
    }
  }

  ngOnInit() {
    const fields = {
      title: [
        null,
        [Validators.required]
      ],
      author: [
        null,
        [Validators.required]
      ],
      year: [
        null,
        [Validators.required, Validators.pattern("[0-9]*")]
      ],
      genre: [
        null,
        [Validators.required]
      ]
    };

    this.form = this._formBuilder.group({
      ...fields
    });

    console.log(this.formType);

    switch (this.formType) {
      case FormType.NewBook:
        break;
      case FormType.ExistingBook:
        this.isLoading.set(true);

        this._bookId = this._activatedRoute.snapshot.params['id'];

        this._iBookService.getBook(this._bookId)
          .pipe(
            catchError(() => {
              this._notification.showToast(true, 'No book found!');
              this._router.navigate(['library']);
              return of(null);
            }),
            finalize(() => this.isLoading.set(false))
          )
          .subscribe((res) => {
            this.isLoading.set(false);

            this.form.reset({
              title: res?.title,
              author: res?.author,
              year: res?.year,
              genre: res?.genre
            });
          });
    }
  }

  onSubmit() {
    this.isSaving = true;

    const bookParam: IBookParams = {
      title: this.form.controls['title'].value,
      author: this.form.controls['author'].value,
      year: this.form.controls['year'].value,
      genre: this.form.controls['genre'].value,
    }

    switch (this.formType) {
      case FormType.NewBook:
        this._iBookService.createBook(bookParam)
          .pipe(
            catchError((err) => {
              this._notification.showToast(true, 'Http error: '+err.message);
              return of([]);
            }),
            finalize(() => this.isSaving = false)
          )
          .subscribe(() => {
            this._notification.showToast(false, 'You have successfully added a new book');
            this._router.navigate(['library'])
          });
          
        break;
      case FormType.ExistingBook:
        const updateParams: IBook = {
          ...bookParam,
          id: this._bookId
        };
        this._iBookService.updateBook(updateParams)
          .pipe(
            catchError((err) => {
              this._notification.showToast(true, 'Http error: '+err.message);
              return of([]);
            }),
            finalize(() => this.isSaving = false)
          )
          .subscribe(() => {
            this._notification.showToast(false, 'You have successfully updated the book');
            this._router.navigate(['library'])
          });
        
        break;
    }
  }
}