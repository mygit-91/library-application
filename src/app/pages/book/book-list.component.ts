import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book/book.service';
import { AuthService } from '../../services/auth/auth.service';
import { GetBookListRequest, Books } from '../../models/book.model';
import { EditBookComponent } from './edit-book.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DeleteDialogComponent } from '../dialogs/delete-dialog.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent {
  private authService = inject(AuthService);
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);

  listBooks = signal<Books[]>([]);
  searchFilter = signal<string>('all');
  searchText = signal<string>('');
  selectedBookId = signal<string | null>(null);

  onFilterChange(newFilter: string): void {
    this.searchFilter.set(newFilter);
  }

  onQueryChange(newQuery: string): void {
    this.searchText.set(newQuery);
  }

  onSearch(): void {
    if (this.searchFilter() != 'all' && !this.searchText().trim()) {
      window.alert('Please enter value for searching');
    } else {
      const input: GetBookListRequest = {
        searchTopic: this.searchFilter(),
        searchText: this.searchText().trim(),
        isStaff: this.authService.isLoggedIn(),
      };

      this.bookService.getBookList(input).subscribe({
        next: (response) => {
          // Update list
          this.listBooks.set(response);
        },
        error: (error) => {
          window.alert(error?.message || 'Get data failed!');
        },
      });
    }
  }

  onClear(): void {
    this.searchFilter.set('all');
    this.searchText.set('');
    this.listBooks.set([]);
  }

  // Open detail dialog
  selectedBook = computed(() => {
    const id = this.selectedBookId();
    return id !== null ? this.listBooks().find((b) => b.bookId === id) : null;
  });

  openDetatils(bookId: string): void {
    this.selectedBookId.set(bookId);
  }

  closeDetatils(): void {
    this.selectedBookId.set(null);
  }

  // Open edit dialog
  onEdit(bookId: string) {
    const dialogRef = this.dialog.open(EditBookComponent, {
      width: '70vw',
      height: 'cal(100vh-10px)',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: { bookId: bookId },
    });

    // On dialog response
    dialogRef.afterClosed().subscribe((updatedItem) => {
      if (updatedItem) {
        // Update list
        this.listBooks.update((list) =>
          list.map((item) => (item.bookId === updatedItem.bookId ? updatedItem : item)),
        );
      }
    });
  }

  // Open delete dialog
  onDelete(book: Books) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: { message: `Do you want to delete the book "${book.title}"?` },
    });

    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.bookService.deleteBook(book.bookId).subscribe({
          next: (message) => {
            // Update list
            this.listBooks.update((list) => list.filter((item) => item.bookId !== book.bookId));
            window.alert(message);
          },
          error: (error) => {
            window.alert(error?.message || 'Delete data failed!');
          },
        });
      }
    });
  }
}
