import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { BookReturnComponent } from '../borrowing/book-return.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BorrowData, GetBorrowListRequest } from '../../models/borrow.model';
import { BorrowService } from '../../services/borrowings/borrow.service';

@Component({
  selector: 'app-borrow-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './borrow-list.component.html',
  styleUrls: ['./borrow-list.component.css'],
})
export class BorrowListComponent {
  private authService = inject(AuthService);
  private borrowService = inject(BorrowService);
  private dialog = inject(MatDialog);

  borrowList = signal<BorrowData[]>([]);
  searchFilter = signal<string>('all');
  searchText = signal<string>('');
  selectedBorrowId = signal<string | null>(null);

  onFilterChange(newFilter: string): void {
    this.searchFilter.set(newFilter);
  }

  onQueryChange(newQuery: string): void {
    this.searchText.set(newQuery);
  }

  onSearch(): void {
    if (this.searchFilter() != 'all' && !this.searchText().trim()) {
      alert('Please enter value for searching');
    } else {
      const input: GetBorrowListRequest = {
        searchTopic: this.searchFilter(),
        searchText: this.searchText().trim(),
        isStaff: this.authService.isLoggedIn(),
        isBorrowList: true,
      };

      this.borrowService.getBorrowingsList(input).subscribe({
        next: (response) => {
          // Update list
          this.borrowList.set(response);
        },
        error: (error) => {
          alert(error?.message || 'Get data failed!');
        },
      });
    }
  }

  onClear(): void {
    this.searchFilter.set('all');
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

  // Open return dialog
  openReturn(borrow: BorrowData) {
    const dialogRef = this.dialog.open(BookReturnComponent, {
      width: '70vw',
      height: 'cal(100vh-10px)',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: borrow,
    });

    // On dialog response
    dialogRef.afterClosed().subscribe((returnedBook) => {
      if (returnedBook) {
        // console.log('returnedBook', returnedBook);
        // Update list
        this.borrowList.update((list) =>
          list.filter((item) => item.borrowId !== returnedBook.borrowId),
        );
      }
    });
  }
}
