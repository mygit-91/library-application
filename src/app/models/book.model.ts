export interface Books {
  bookId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: string;
  availableCopies: string;
  location: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
}

export interface GetBookRequest {
  searchTopic: string;
  searchText: string;
  isStaff: boolean;
}

export interface GetBookListResponse {
  status: number;
  message: string;
  data: Books[];
}

export interface AddNewBook {
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

export interface AddNewBookResponse {
  status: number;
  message: string;
  data: { bookId: '' };
}
