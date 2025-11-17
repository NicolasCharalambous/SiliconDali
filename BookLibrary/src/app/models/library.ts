export interface IBook extends IBookParams {
    id: string;
}

export interface IBookParams {
  title: string;
  author: string;
  year: number;
  genre: string;
}

export interface IBookDeleteResp {
  id: number;
  message: string;
}