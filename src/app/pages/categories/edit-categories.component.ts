import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CategoriesService } from '../../services/categories/categories.service';

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

  private categoriesService = inject(CategoriesService);
  private fb = inject(FormBuilder);

  categoriesForm!: FormGroup;

  constructor() {
    // Create form
    this.categoriesForm = this.fb.group({
      categoryId: [''],
      categoryName: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Fetch data
    this.categoriesForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.categoriesForm.valid) {
      this.categoriesService.updateCategories(this.categoriesForm.value).subscribe({
        next: (message) => {
          alert(message);
          this.dialogRef.close(this.categoriesForm.value);
        },
        error: (error) => {
          window.alert(error?.message || 'Update data failed!');
        },
      });
    } else {
      this.categoriesForm.markAllAsTouched();
    }
  }

  onClear() {
    this.categoriesForm.reset({
      categoryName: '',
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
