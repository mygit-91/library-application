import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../services/book/book.service';

interface CategoryOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css'],
})
export class NewBookComponent {
  private bookService = inject(BookService);
  bookForm: FormGroup;

  categories = signal<CategoryOption[]>([
    { id: 'e1d2c3b4-a5b6-4c7d-8e9f-0a1b2c3d4e5f', name: 'Educations' },
    { id: 'f3e2d1c0-b9a8-4736-8251-0d9c8b7a6f5e', name: 'Sports' },
  ]);

  constructor(private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,13}$/)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
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

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.bookService.addNewBooks(this.bookForm.value).subscribe({
        next: (response) => {
          alert(response.message + ', Book ID: ' + response.data.bookId);

          this.bookForm.reset({
            isActive: true,
            availableCopies: '0',
            totalCopies: '0',
            categoryId: '',
          });
        },
        error: (error) => {
          window.alert(error?.message || 'Get data failed');
        },
      });
    } else {
      this.bookForm.markAllAsTouched();
    }
  }
}
