import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserState } from '../../states/user.state';
import { ReturnBookRequest } from '../../models/borrow.model';
import { BorrowData } from '../../models/borrow.model';
import { BorrowService } from '../../services/borrowings/borrow.service';

@Component({
  selector: 'app-book-return',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-return.component.html',
  styleUrls: ['./book-return.component.css'],
})
export class BookReturnComponent {
  readonly data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<BookReturnComponent>);

  private borrowService = inject(BorrowService);
  private userState = inject(UserState);
  private user = this.userState.currentUser();

  borrowForm: FormGroup;
  isBorrowOverTime = signal<boolean>(false);
  minReturnDate = signal<string>('');

  constructor(private fb: FormBuilder) {
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    this.minReturnDate.set(today);

    this.borrowForm = this.fb.group({
      isbn: [''],
      title: [''],
      memberIdCard: [''],
      memberName: [''],
      borrowDate: [''],
      dueDate: [''],
      timeStatus: [''],
      returnDate: [today, [Validators.required]],
      finesAmount: [''],
      paymentStatus: [''],
      paidDate: [''],
    });
  }

  ngOnInit() {
    // Fetch Data
    this.fetchData(this.data);
  }

  fetchData(borrow: BorrowData) {
    this.borrowForm.patchValue(
      {
        isbn: borrow.isbn,
        title: borrow.bookTitle,
        memberIdCard: borrow.memberCardId,
        memberName: borrow.memberName,
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        timeStatus: this.data.isOverTime == false ? 'On Time' : 'Over Time',
      },
      { emitEvent: false },
    );

    // Require fines if time status is over time
    if (this.data.isOverTime) {
      this.isBorrowOverTime.set(true);
      this.borrowForm.get('finesAmount')?.setValidators([Validators.required]);
      this.borrowForm.get('finesAmount')?.updateValueAndValidity();
      this.borrowForm.get('paymentStatus')?.setValidators([Validators.required]);
      this.borrowForm.get('paymentStatus')?.updateValueAndValidity();
      this.borrowForm.get('paidDate')?.setValidators([Validators.required]);
      this.borrowForm.get('paidDate')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.borrowForm.valid) {
      const input: ReturnBookRequest = {
        borrowId: this.data.borrowId,
        bookId: this.data.bookId,
        memberId: this.data.memberId,
        staffId: this.user?.staffId || '',
        returnDate: this.borrowForm.get('returnDate')?.value,
        finesId: this.data.finesId,
        amount: this.borrowForm.get('finesAmount')?.value || 0,
        paymentStatus: this.borrowForm.get('paymentStatus')?.value,
        paidDate: this.borrowForm.get('paidDate')?.value || null,
        isOverTime: this.data.isOverTime,
      };

      // console.log('input', input);
      this.borrowService.returnBook(input).subscribe({
        next: (message) => {
          alert(message);
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
      finesAmount: '',
      paymentStatus: '',
      paidDate: null,
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
