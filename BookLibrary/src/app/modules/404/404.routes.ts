import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/404.component';

export const PAGE_NOT_FOUND_ROUTES: Routes = [
  {
    path: '',
    component: PageNotFoundComponent
  }
];