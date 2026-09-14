import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

interface SubMenuItem {
  subMenuId: number;
  menuId: number;
  title: string;
  route: string;
}

interface MenuItem {
  menuId: number;
  title: string;
  icon: string;
  isOpen: boolean;
  subMenu: SubMenuItem[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isMobileMenuOpen = signal<boolean>(false);

  menuItems = signal<MenuItem[]>([
    {
      menuId: 1,
      title: 'My Profile',
      icon: '👤',
      isOpen: false,
      subMenu: [
        { subMenuId: 1, title: 'Profile', route: 'admin-profile', menuId: 1 },
        { subMenuId: 2, title: 'Logout', route: 'logout', menuId: 1 },
      ],
    },
    {
      menuId: 2,
      title: 'Book',
      icon: '📚',
      isOpen: false,
      subMenu: [
        { subMenuId: 3, title: 'Book List', route: 'book-list', menuId: 2 },
        { subMenuId: 4, title: 'Add Book', route: 'add-book', menuId: 2 },
      ],
    },
    {
      menuId: 3,
      title: 'Categories',
      icon: '🏷️',
      isOpen: false,
      subMenu: [
        { subMenuId: 5, title: 'Manage Categories', route: 'manage-categories', menuId: 3 },
      ],
    },
    {
      menuId: 4,
      title: 'Borrowing',
      icon: '🔄',
      isOpen: false,
      subMenu: [
        { subMenuId: 6, title: 'Borrow List', route: 'borrow-list', menuId: 4 },
        { subMenuId: 7, title: 'Borrow Book', route: 'borrow-book', menuId: 4 },
        { subMenuId: 8, title: 'Book Return', route: 'book-return', menuId: 4 },
        { subMenuId: 9, title: 'Borrow History', route: 'borrow-history', menuId: 4 },
      ],
    },
    {
      menuId: 5,
      title: 'Member',
      icon: '👥',
      isOpen: false,
      subMenu: [
        { subMenuId: 10, title: 'Member List', route: 'member-list', menuId: 5 },
        { subMenuId: 11, title: 'Add Member', route: 'add-member', menuId: 5 },
      ],
    },
  ]);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleSubMenu(index: number): void {
    this.menuItems.update((items) => {
      const updated = [...items];

      updated.forEach((item, i) => {
        if (i !== index) item.isOpen = false;
      });
      updated[index].isOpen = !updated[index].isOpen;
      return updated;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
