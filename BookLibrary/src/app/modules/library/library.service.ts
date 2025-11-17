import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBook, IBookParams } from '../../models/library';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IBookService {
    private _baseUrl = '/api/books';

    constructor(private _http: HttpClient) {}

    loadBooks(): Observable<IBook[]> {
        return this._http.get<IBook[]>(this._baseUrl);
    }

    getBook(id: string): Observable<IBook | undefined> {
        return this._http.get<IBook>(`${this._baseUrl}/${id}`);
    }

    createBook(book: IBookParams): Observable<IBook> {
        const newBook = { ...book, id: Date.now().toString() };
        return this._http.post<IBook>(this._baseUrl, newBook);
    }

    updateBook(book: IBook): Observable<IBook> {
        return this._http.put<IBook>(`${this._baseUrl}/${book.id}`, book);
    }

    deleteBook(id: number) {
        return this._http.delete(`${this._baseUrl}/${id}`);
    }
}