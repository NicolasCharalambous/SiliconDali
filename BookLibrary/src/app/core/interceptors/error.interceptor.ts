import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err) => {
                if (err.status === 500) {
                    console.error(`Interceptor: Error from API, Error: ${err?.Message}`);
                } else if (err.status === 404) {
                    console.error(`Interceptor: API not found, Error: ${err?.Message}`);
                } else if (err.status === 400) {
                    console.error(`Interceptor: Bad Request, Error: ${err?.Message}`);
                }

                return throwError(() => err);
            })
        )
    }
}