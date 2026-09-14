import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MemberComponent } from './pages/member/member.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard.component';
import { NewBookComponent } from './pages/book/new-book.component';
import { ListBookComponent } from './pages/book/list-book.component';
import { WelcomeComponent } from './pages/admin/welcome.component';
import { authGuard } from './services/auth/auth.guard';
import { authGuardAdmin } from './services/auth/auth.guard-admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'member', component: MemberComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuardAdmin] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'list-book', component: ListBookComponent },
      { path: 'new-book', component: NewBookComponent },
    ],
    canActivate: [authGuard],
  },

  // {
  //   path: '',
  //   component: MainLayoutComponent,
  //   children: [
  //     { path: '', component: HomeComponent },
  //     { path: 'about', component: AboutComponent }
  //   ]
  // }
];
