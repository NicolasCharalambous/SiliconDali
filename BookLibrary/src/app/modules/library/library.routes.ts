import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { FormAction } from '../../enums/form-action.enum';

export const LIBRARY_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: FormAction.Add,
    component: BookDetailsComponent
  },
  {
    path: FormAction.Edit + '/:id',
    component: BookDetailsComponent
  }
];