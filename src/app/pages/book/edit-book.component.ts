import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BookService } from '../../services/book/book.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { Categories, GetCategoriesListRequest } from '../../models/categories.model';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
})
export class EditBookComponent {
  readonly data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EditBookComponent>);

  private bookService = inject(BookService);
  private categoriesService = inject(CategoriesService);
  private fb = inject(FormBuilder);

  bookForm!: FormGroup;
  categories = signal<Categories[]>([]);

  constructor() {
    // Create form
    this.bookForm = this.fb.group({
      bookId: [''],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,13}$/)]],
      title: ['', [Validators.required]],
      author: ['', Validators.required],
      publisher: ['', Validators.required],
      publishYear: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      totalCopies: ['0', [Validators.required, Validators.min(0)]],
      availableCopies: ['0', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      categoryId: ['', Validators.required],
      categoryName: [''],
      isActive: [true],
    });
  }

  ngOnInit() {
    // Load Initial data
    this.getCategoriesList();
    this.fetchBookData(this.data.bookId);

    // Track category changes
    this.onCategoryChanges();
  }

  fetchBookData(bookId: string) {
    this.bookService.getBookById(bookId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Fetch data
          this.bookForm.patchValue(data[0], { emitEvent: false });
          if (!data || data.length == 0) {
            alert('No book found.');
          }
        } else {
          alert('Book data not found');
        }
      },
      error: (error) => {
        alert(error?.message || 'Get book data failed!');
      },
    });
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

  onCategoryChanges() {
    this.bookForm.get('categoryId')?.valueChanges.subscribe((newCategoryId) => {
      // Get selected category
      const selectedCat = this.categories().find((item) => item.categoryId === newCategoryId);
      if (selectedCat) {
        // Set selected category name to form
        this.bookForm.get('categoryName')?.setValue(selectedCat.categoryName, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      // console.log(this.bookForm.value);
      this.bookService.updateBook(this.bookForm.value).subscribe({
        next: (message) => {
          alert(message);
          this.dialogRef.close(this.bookForm.value);
        },
        error: (error) => {
          alert(error?.message || 'Update data failed!');
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

  close() {
    this.dialogRef.close(false);
  }
}
