import { Injectable, signal, inject } from '@angular/core';
import { MenuItem } from '../../models/menu.model';
import { UserState } from '../../states/user.state';

@Injectable({
  providedIn: 'root', // Register singleton to shear with global
})
export class MenuService {
  private userState = inject(UserState);
  private user = this.userState.currentUser();

  // Default menus
  menuItems = signal<MenuItem[]>([
    {
      menuId: 1,
      title: this.user?.firstName || 'My Profile',
      icon: '👤',
      isOpen: false,
      subMenu: [
        { title: 'Profile', route: 'profile' },
        { title: 'Logout', route: 'logout' },
      ],
    },
    {
      menuId: 2,
      title: 'Book',
      icon: '📚',
      isOpen: false,
      subMenu: [
        { title: 'Book List', route: 'book-list' },
        { title: 'Add Book', route: 'add-book' },
      ],
    },
    {
      menuId: 3,
      title: 'Categories',
      icon: '🏷️',
      isOpen: false,
      subMenu: [
        { title: 'Categories List', route: 'categories-list' },
        { title: 'Add Categories', route: 'add-categories' },
      ],
    },
    {
      menuId: 4,
      title: 'Borrowing',
      icon: '🔄',
      isOpen: false,
      subMenu: [
        { title: 'Borrow List', route: 'borrow-list' },
        { title: 'Borrow History', route: 'borrow-history' },
      ],
    },
    {
      menuId: 5,
      title: 'Member',
      icon: '👥',
      isOpen: false,
      subMenu: [
        { title: 'Member List', route: 'member-list' },
        { title: 'Add Member', route: 'add-member' },
      ],
    },
  ]);
}
