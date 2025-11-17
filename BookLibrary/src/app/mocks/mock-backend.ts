import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { IBook } from '../models/library';

@Injectable()
export class MockBackend implements InMemoryDbService {
  createDb() {
    const books: IBook[] = [
      { id: "1763373039234", title: 'Clean Code', author: 'Robert C. Martin', year: 2025, genre: 'Comedy' },
      { id: "1763373039235", title: 'Atomic Habits', author: 'James Clear', year: 2025, genre: 'Comedy' }
    ];
    return { books };
  }
}