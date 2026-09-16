import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BookService } from '../../services/book/book.service';

interface CategoryOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-edit-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.css'],
})
export class EditCategoriesComponent {
  readonly data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EditCategoriesComponent>);

  private bookService = inject(BookService);
  private fb = inject(FormBuilder);

  bookForm!: FormGroup;

  categories = signal<CategoryOption[]>([
    { id: 'e1d2c3b4-a5b6-4c7d-8e9f-0a1b2c3d4e5f', name: 'Educations' },
    { id: 'f3e2d1c0-b9a8-4736-8251-0d9c8b7a6f5e', name: 'Sports' },
  ]);

  constructor() {
    // Create form
    this.bookForm = this.fb.group({
      bookId: [''],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,13}$/)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
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
    // Fetch data
    this.fetchBookData(this.data.bookId);
  }

  fetchBookData(bookId: string) {
    this.bookService.getBookById(bookId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Set default value
          this.bookForm.patchValue(data[0]);
        } else {
          window.alert('Data not found');
        }
      },
      error: (error) => {
        window.alert(error?.message || 'Get data failed!');
      },
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.bookService.updateBook(this.bookForm.value).subscribe({
        next: (message) => {
          //alert(message);
          this.dialogRef.close(this.bookForm.value);
        },
        error: (error) => {
          window.alert(error?.message || 'Get data failed!');
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
