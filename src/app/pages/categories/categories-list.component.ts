import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../services/categories/categories.service';
import { Categories, GetCategoriesListRequest } from '../../models/categories.model';
import { EditCategoriesComponent } from './edit-categories.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DeleteDialogComponent } from '../dialogs/delete-dialog.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent {
  private categoriesService = inject(CategoriesService);
  private dialog = inject(MatDialog);

  listCategories = signal<Categories[]>([]);
  searchFilter = signal<string>('all');
  searchText = signal<string>('');

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
      const input: GetCategoriesListRequest = {
        searchTopic: this.searchFilter(),
        searchText: this.searchText().trim(),
      };

      this.categoriesService.getCategoriesList(input).subscribe({
        next: (response) => {
          // Update list
          this.listCategories.set(response);
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
    this.listCategories.set([]);
  }

  // Open edit dialog
  onEdit(categories: Categories) {
    const dialogRef = this.dialog.open(EditCategoriesComponent, {
      width: '35vw',
      height: 'cal(100vh-10px)',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: categories,
    });

    // On dialog response
    dialogRef.afterClosed().subscribe((updatedItem) => {
      if (updatedItem) {
        // Update list
        this.listCategories.update((list) =>
          list.map((item) => (item.categoryId === updatedItem.categoryId ? updatedItem : item)),
        );
      }
    });
  }

  // Open delete dialog
  onDelete(categories: Categories) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: { message: `Do you want to delete the categories "${categories.categoryName}"?` },
    });

    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.categoriesService.deleteCategories(categories.categoryId).subscribe({
          next: (message) => {
            // Update list
            this.listCategories.update((list) =>
              list.filter((item) => item.categoryId !== categories.categoryId),
            );
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
