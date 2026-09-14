import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string; // เพิ่ม ISBN
  stock: number; // เพิ่ม จำนวนคงเหลือ
  price: number;
  coverImage: string;
  description: string;
}

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent {
  searchText = signal<string>('');
  activeSearchText = signal<string>('');
  selectedBookId = signal<number | null>(null);

  books = signal<Book[]>([]);

  onQueryChange(newQuery: string): void {
    this.searchText.set(newQuery);
  }

  onSearch(): void {
    this.activeSearchText.set(this.searchText().trim());
  }

  onClear(): void {
    this.searchText.set('');
    this.activeSearchText.set('');
  }

  filteredBooks = computed(() => {
    const query = this.activeSearchText().toLowerCase();

    if (!query) {
      return [];
    }

    return this.books().filter((book) => {
      const matchesText =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query) ||
        book.isbn.replace(/-/g, '').includes(query.replace(/-/g, ''));

      return matchesText;
    });
  });

  selectedBook = computed(() => {
    const id = this.selectedBookId();
    return id !== null ? this.books().find((b) => b.id === id) : null;
  });

  openPopup(id: number): void {
    this.selectedBookId.set(id);
  }

  closePopup(): void {
    this.selectedBookId.set(null);
  }
}
