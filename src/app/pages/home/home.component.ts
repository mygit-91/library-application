import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book/book.service';
import { AuthService } from '../../services/auth/auth.service';
import { GetBookListRequest, Books } from '../../models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private authService = inject(AuthService);
  private bookService = inject(BookService);

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
        next: (data) => {
          // Update book list
          this.listBooks.set(data);
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

  openPopup(id: string): void {
    this.selectedBookId.set(id);
  }

  closePopup(): void {
    this.selectedBookId.set(null);
  }
}
