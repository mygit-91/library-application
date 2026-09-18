import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { UserState } from '../../states/user.state';
import { Books } from '../../models/book.model';
import { AddBorrowRequest } from '../../models/borrow.model';
import { BorrowService } from '../../services/borrowings/borrow.service';
import { MembersService } from '../../services/members/member.service';

@Component({
  selector: 'app-book-borrow',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-borrow.component.html',
  styleUrls: ['./book-borrow.component.css'],
})
export class BookBorrowComponent {
  readonly data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<BookBorrowComponent>);

  private borrowService = inject(BorrowService);
  private membersService = inject(MembersService);
  private userState = inject(UserState);
  private user = this.userState.currentUser();

  borrowForm: FormGroup;
  minBorrowDate = signal<string>('');
  minDueDate = signal<string>('');

  constructor(private fb: FormBuilder) {
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    this.minBorrowDate.set(today);
    this.minDueDate.set(today);

    this.borrowForm = this.fb.group(
      {
        isbn: [''],
        title: [''],
        memberId: [''],
        memberIdCard: ['', [Validators.required]],
        memberName: ['', [Validators.required]],
        borrowDate: ['', [Validators.required]],
        dueDate: ['', [Validators.required]],
      },
      {
        // Validate dueDate
        validators: this.dateLessThanValidator,
      },
    );

    // Check selecte borrow date
    this.borrowForm.get('borrowDate')?.valueChanges.subscribe((value: string) => {
      if (value) {
        // Disable dueDate can not select less than borrow date
        this.minDueDate.set(value);
      } else {
        // borrowDate is emptyp use current date
        this.minDueDate.set(today);
      }
    });
  }

  ngOnInit() {
    // Fetch Data
    this.fetchData(this.data);
  }

  fetchData(book: Books) {
    this.borrowForm.patchValue(
      {
        isbn: book.isbn,
        title: book.title,
      },
      { emitEvent: false },
    );
  }

  // Validate due date must be more than borrow date
  dateLessThanValidator(group: AbstractControl): ValidationErrors | null {
    const borrowDateStr = group.get('borrowDate')?.value;
    const dueDateStr = group.get('dueDate')?.value;

    if (borrowDateStr && dueDateStr) {
      const borrow = new Date(borrowDateStr);
      const due = new Date(dueDateStr);

      if (due < borrow) {
        group.get('dueDate')?.setErrors({ dateInvalid: true });
        return { dateInvalid: true };
      }
    }

    const dueControl = group.get('dueDate');
    if (dueControl?.hasError('dateInvalid')) {
      dueControl.setErrors(null);
    }
    return null;
  }

  getMember() {
    const idCard = this.borrowForm.get('memberIdCard')?.value;
    if (!idCard) {
      alert('Please enter id card with in 13 digits.');
    } else {
      this.membersService.getBookById(idCard).subscribe({
        next: (data) => {
          if (data) {
            this.borrowForm.patchValue(
              {
                memberId: data.memberId,
                memberName: data.firstName + ' ' + data.lastName,
              },
              { emitEvent: false },
            );
          } else {
            alert('No member found.');
          }
        },
        error: (error) => {
          alert(error?.message || 'Get data failed!');
        },
      });
    }
  }

  onSubmit(): void {
    if (this.borrowForm.valid) {
      const input: AddBorrowRequest = {
        bookId: this.data.bookId,
        staffId: this.user?.staffId || '',
        memberId: this.borrowForm.get('memberId')?.value,
        borrowDate: this.borrowForm.get('borrowDate')?.value,
        dueDate: this.borrowForm.get('dueDate')?.value,
      };

      this.borrowService.addBorrowings(input).subscribe({
        next: (message) => {
          alert(message);
          this.data.availableCopies -= 1;
          this.dialogRef.close(this.data);
        },
        error: (error) => {
          alert(error?.message || 'Update data failed!');
        },
      });
    } else {
      this.borrowForm.markAllAsTouched();
    }
  }

  onClear() {
    this.borrowForm.patchValue({
      memberId: '',
      memberIdCard: '',
      memberName: '',
      borrowDate: null,
      dueDate: null,
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
