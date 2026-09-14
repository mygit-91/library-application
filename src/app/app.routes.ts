import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './services/auth/auth.guard';
import { authGuardAdmin } from './services/auth/auth.guard-admin';
import { DashboardComponent } from './pages/admin/dashboard.component';
import { WelcomeComponent } from './pages/admin/welcome.component';
import { BookListComponent } from './pages/book/book-list.component';
import { AddBookComponent } from './pages/book/add-book.component';
import { EditBookComponent } from './pages/book/edit-book.component';
import { ManageCategoriesComponent } from './pages/categories/manage-categories.component';
import { BorrowListComponent } from './pages/borrowing/borrow-list.component';
import { BorrowBookComponent } from './pages/borrowing/borrow-book.component';
import { BookReturnComponent } from './pages/borrowing/book-return.component';
import { BorrowHistoryComponent } from './pages/borrowing/borrow-history.component';
import { MemberListComponent } from './pages/member/member-list.component';
import { AddMemberComponent } from './pages/member/add-member.component';
import { EditMemberComponent } from './pages/member/edit-member.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuardAdmin] },
  //{ path: 'add-member', component: AddMemberComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'book-list', component: BookListComponent },
      { path: 'add-book', component: AddBookComponent },
      { path: 'edit-book', component: EditBookComponent },
      { path: 'manage-categories', component: ManageCategoriesComponent },
      { path: 'borrow-list', component: BorrowListComponent },
      { path: 'borrow-book', component: BorrowBookComponent },
      { path: 'book-return', component: BookReturnComponent },
      { path: 'borrow-history', component: BorrowHistoryComponent },
      { path: 'member-list', component: MemberListComponent },
      { path: 'add-member', component: AddMemberComponent },
      { path: 'edit-member', component: EditMemberComponent },
    ],
    canActivate: [authGuard],
  },
];
