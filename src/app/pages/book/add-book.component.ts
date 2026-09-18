import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../services/book/book.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { Categories, GetCategoriesListRequest } from '../../models/categories.model';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent {
  private bookService = inject(BookService);
  private categoriesService = inject(CategoriesService);
  bookForm: FormGroup;

  categories = signal<Categories[]>([]);

  constructor(private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,13}$/)]],
      title: ['', [Validators.required]],
      author: ['', Validators.required],
      publisher: ['', Validators.required],
      publishYear: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      totalCopies: ['0', [Validators.required, Validators.min(0)]],
      availableCopies: ['0', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      categoryId: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit() {
    // Load Initial data
    this.getCategoriesList();
  }

  getCategoriesList() {
    const input: GetCategoriesListRequest = {
      searchTopic: 'all',
      searchText: '',
    };

    this.categoriesService.getCategoriesList(input).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Set values
          this.categories.set(data);
          if (!data || data.length == 0) {
            alert('No categories found.');
          }
        } else {
          alert('Categorie data not found');
        }
      },
      error: (error) => {
        alert(error?.message || 'Get categorie data failed!');
      },
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.bookService.addBook(this.bookForm.value).subscribe({
        next: (response) => {
          alert(response);
          this.onClear();
        },
        error: (error) => {
          alert(error?.message || 'Save data failed!');
        },
      });
    } else {
      this.bookForm.markAllAsTouched();
    }
  }

  onClear() {
    this.bookForm.reset({
      isActive: true,
      availableCopies: '0',
      totalCopies: '0',
      categoryId: '',
    });
  }
}
