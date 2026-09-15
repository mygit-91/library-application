export interface Books {
  bookId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
  location: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
}

export interface GetBookByIdResponse {
  status: number;
  message: string;
  data: Books[];
}

export interface GetBookListRequest {
  searchTopic: string;
  searchText: string;
  isStaff: boolean;
}

export interface GetBookListResponse {
  status: number;
  message: string;
  data: Books[];
}

export interface AddBookRequest {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
  location: string;
  categoryId: string;
  isActive: boolean;
}

export interface AddBookResponse {
  status: number;
  message: string;
  data: { bookId: '' };
}

export interface UpdateBookRequest {
  bookId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
  location: string;
  categoryId: string;
  isActive: boolean;
}

export interface UpdateBookResponse {
  status: number;
  message: string;
  data: {};
}

export interface DeleteBookResponse {
  status: number;
  message: string;
  data: {};
}
