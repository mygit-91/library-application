import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../services/categories/categories.service';

@Component({
  selector: 'app-add-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.css'],
})
export class AddCategoriesComponent {
  private categoriesService = inject(CategoriesService);
  categoriesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.categoriesForm = this.fb.group({
      categoryName: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.categoriesForm.valid) {
      this.categoriesService.addCategories(this.categoriesForm.value).subscribe({
        next: (response) => {
          this.onClear();
          alert(response);
        },
        error: (error) => {
          window.alert(error?.message || 'Save data failed!');
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
}
