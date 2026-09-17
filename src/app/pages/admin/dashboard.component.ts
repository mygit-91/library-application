import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MenuService } from '../../services/menus/menu.service';

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
  private menuService = inject(MenuService);

  menuItems = this.menuService.menuItems;
  isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  // Update is open menu
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
