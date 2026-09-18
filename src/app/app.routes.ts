import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './services/auth/auth.guard';
import { authGuardAdmin } from './services/auth/auth.guard-admin';
import { DashboardComponent } from './pages/admin/dashboard.component';
import { WelcomeComponent } from './pages/admin/welcome.component';
import { PofileComponent } from './pages/admin/profile.component';
import { BookListComponent } from './pages/book/book-list.component';
import { AddBookComponent } from './pages/book/add-book.component';
import { CategoriesListComponent } from './pages/categories/categories-list.component';
import { AddCategoriesComponent } from './pages/categories/add-categories.component';
import { BorrowListComponent } from './pages/borrowing/borrow-list.component';
import { BorrowHistoryComponent } from './pages/borrowing/borrow-history.component';
import { MemberListComponent } from './pages/member/member-list.component';
import { MemberBorrowListComponent } from './pages/member/member-borrow-list.component';
import { AddMemberComponent } from './pages/member/add-member.component';
import { EditMemberComponent } from './pages/member/edit-member.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuardAdmin] },
  { path: 'member-borrow-list', component: MemberBorrowListComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'profile', component: PofileComponent },
      { path: 'book-list', component: BookListComponent },
      { path: 'add-book', component: AddBookComponent },
      { path: 'categories-list', component: CategoriesListComponent },
      { path: 'add-categories', component: AddCategoriesComponent },
      { path: 'borrow-list', component: BorrowListComponent },
      { path: 'borrow-history', component: BorrowHistoryComponent },
      { path: 'member-list', component: MemberListComponent },
      { path: 'add-member', component: AddMemberComponent },
      { path: 'edit-member', component: EditMemberComponent },
    ],
    canActivate: [authGuard],
  },
];
