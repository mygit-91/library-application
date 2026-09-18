import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BorrowData, GetBorrowListRequest } from '../../models/borrow.model';
import { BorrowService } from '../../services/borrowings/borrow.service';

@Component({
  selector: 'app-member-borrow-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './member-borrow-list.component.html',
  styleUrls: ['./member-borrow-list.component.css'],
})
export class MemberBorrowListComponent {
  private authService = inject(AuthService);
  private borrowService = inject(BorrowService);

  borrowList = signal<BorrowData[]>([]);
  searchText = signal<string>('');
  selectedBorrowId = signal<string | null>(null);

  onQueryChange(newQuery: string): void {
    this.searchText.set(newQuery);
  }

  onSearch(): void {
    if (!this.searchText().trim() || this.searchText().trim().length < 13) {
      alert('Please enter id card with in 13 digits');
    } else {
      const input: GetBorrowListRequest = {
        searchTopic: 'membercardid',
        searchText: this.searchText().trim(),
        isStaff: this.authService.isLoggedIn(),
        isBorrowList: true,
      };

      this.borrowService.getBorrowingsList(input).subscribe({
        next: (response) => {
          // Update list
          this.borrowList.set(response);
          if (!response || response.length == 0) {
            alert('No data found.');
          }
        },
        error: (error) => {
          alert(error?.message || 'Get data failed!');
        },
      });
    }
  }

  onClear(): void {
    this.searchText.set('');
    this.borrowList.set([]);
  }

  // Open detail dialog
  selectedBorrow = computed(() => {
    const id = this.selectedBorrowId();
    return id !== null ? this.borrowList().find((b) => b.borrowId === id) : null;
  });

  openDetatils(borrowId: string): void {
    this.selectedBorrowId.set(borrowId);
  }

  closeDetatils(): void {
    this.selectedBorrowId.set(null);
  }
}
