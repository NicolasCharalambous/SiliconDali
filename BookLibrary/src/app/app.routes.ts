import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.routes').then(m => m.HOME_ROUTES)
  },
  {
    path: 'library',
    loadChildren: () =>
      import('./modules/library/library.routes').then(m => m.LIBRARY_ROUTES)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadChildren: () =>
      import('./modules/404/404.routes').then(m => m.PAGE_NOT_FOUND_ROUTES)
  }
];
