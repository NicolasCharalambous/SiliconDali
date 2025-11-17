import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { importProvidersFrom } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MockBackend } from './app/mocks/mock-backend';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(MockBackend, {
        delay: 300,
        dataEncapsulation: false
      })
    ),
    ...appConfig.providers
  ]
}).catch((err) => console.error(err));