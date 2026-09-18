export interface BorrowData {
  borrowId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string;
  status: string;
  isOverTime: boolean;
  bookId: string;
  author: string;
  isbn: string;
  bookTitle: string;
  memberId: string;
  memberCardId: string;
  memberName: string;
  finesId: string;
  amount: number;
  paymentStatus: string;
  paidDate: string;
}

export interface GetBorrowListRequest {
  searchTopic: string;
  searchText: string;
  isStaff: boolean;
  isBorrowList: boolean;
}

export interface GetBorrowListResponse {
  status: number;
  message: string;
  data: BorrowData[];
}

export interface AddBorrowRequest {
  bookId: string;
  memberId: string;
  staffId: string;
  borrowDate: string;
  dueDate: string;
}

export interface AddBorrowResponse {
  status: number;
  message: string;
  data: {};
}

export interface ReturnBookRequest {
  borrowId: string;
  bookId: string;
  memberId: string;
  staffId: string;
  returnDate: string;
  finesId: string;
  amount: number;
  paymentStatus: string;
  paidDate: string;
  isOverTime: boolean;
}

export interface ReturnBookResponse {
  status: number;
  message: string;
  data: {};
}
