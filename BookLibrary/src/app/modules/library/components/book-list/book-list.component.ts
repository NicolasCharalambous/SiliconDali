import { AfterViewInit, Component, OnInit, signal, ViewChild } from '@angular/core';
import { IBookService } from '../../library.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { IBook } from '../../../../models/library';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, finalize, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormAction } from '../../../../enums/form-action.enum';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FontAwesomeModule
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, AfterViewInit {

  isLoading = signal(true);

  displayedColumns: string[] = ['id', 'title', 'author', 'year', 'genre', 'actions'];
  dataSource = new MatTableDataSource<IBook>([]);

  @ViewChild('activePaginator') paginator!: MatPaginator;

  constructor(private _iBookService: IBookService, private _notificationService: NotificationService, private _router: Router) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this._loadBooks();
  }
  
  _loadBooks() {
    this.isLoading.set(true);

    this._iBookService.loadBooks().pipe(
      catchError((err) => {
        this._notificationService.showToast(true, 'Http error: '+err.message);
        return of([]);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource._updateChangeSubscription();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editBook(id: number) {
    this._router.navigate([`library/${FormAction.Edit}/${id}`]);
  }

  addNewBook() {
    this._router.navigate(['library/add']);
  }

  deleteBook(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this book?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-primary me-2',
        cancelButton: 'btn btn-outline-secondary'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        this.isLoading.set(true);

        this._iBookService.deleteBook(id).pipe(
          finalize(() => this._loadBooks())
        ).subscribe(() => {
          this._notificationService.showToast(false, 'Book deleted!');
        });
      }
    });
  }
}