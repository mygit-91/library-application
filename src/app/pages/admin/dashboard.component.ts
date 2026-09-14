import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

interface SubMenuItem {
  title: string;
  route: string;
}

interface MenuItem {
  id: number;
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
      id: 1,
      title: 'Book',
      icon: '📚',
      isOpen: false,
      subMenu: [
        { title: 'Book List', route: 'list-book' },
        { title: 'Add New Book', route: 'new-book' },
        { title: 'Category List', route: 'list-category' },
        { title: 'Add New Category', route: 'new-category' },
      ],
    },
    {
      id: 2,
      title: 'Member',
      icon: '👥',
      isOpen: false,
      subMenu: [
        { title: 'Member List', route: 'members/list' },
        { title: 'New Member', route: 'members/add' },
      ],
    },
    {
      id: 3,
      title: 'Borrow-Return',
      icon: '🔄',
      isOpen: false,
      subMenu: [
        { title: 'Borrow Book', route: 'borrow/create' },
        { title: 'Return Book', route: 'borrow/return' },
        { title: 'Borrow History', route: 'borrow/history' },
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
