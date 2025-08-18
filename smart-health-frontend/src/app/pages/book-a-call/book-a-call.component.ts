import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from "../../components/header/header.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-book-a-call',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    HeaderComponent,
    HttpClientModule
  ],
  templateUrl: './book-a-call.component.html',
  styleUrls: ['./book-a-call.component.css']
})
export class BookACallComponent implements OnInit {
  bookingForm!: FormGroup;
  selectedDate!: NgbDateStruct;
  showForm = false;
  availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM'
  ];
  currentMonth = '';
  currentYear = 0;
  disabledDates: NgbDateStruct[] = [];
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    private http: HttpClient
  ) {
    const today = this.calendar.getToday();
    this.minDate = { year: today.year, month: today.month, day: today.day };
    this.maxDate = { year: today.year + 1, month: 12, day: 31 };
    this.config.minDate = this.minDate;
    this.config.maxDate = this.maxDate;
    this.generateDisabledDates(today);
    this.initForm();
  }

  ngOnInit(): void {
    this.updateCurrentMonthYear();
  }

  initForm(): void {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['Male', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      time: ['', Validators.required]
    });
  }

  generateDisabledDates(today: NgbDateStruct): void {
    for (let i = 0; i < 10; i++) {
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const randomMonth = Math.floor(Math.random() * 12) + 1;
      this.disabledDates.push({ year: today.year, month: randomMonth, day: randomDay });
    }
  }

  isDisabled = (date: NgbDateStruct) => {
    const d = new Date(date.year, date.month - 1, date.day);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    return isWeekend || this.disabledDates.some(disabledDate =>
      disabledDate.year === date.year &&
      disabledDate.month === date.month &&
      disabledDate.day === date.day
    );
  }

  onDateSelect(date: NgbDateStruct): void {
    if (!this.isDisabled(date)) {
      this.selectedDate = date;
      this.showForm = true;
    }
  }

  updateCurrentMonthYear(): void {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const today = this.calendar.getToday();
    this.currentMonth = months[today.month - 1];
    this.currentYear = today.year;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const bookingData = {
        ...this.bookingForm.value,
        date: new Date(
          this.selectedDate.year,
          this.selectedDate.month - 1,
          this.selectedDate.day
        ).toISOString().split('T')[0] // YYYY-MM-DD format for backend
      };

      // POST to Django backend API
this.http.post('http://localhost:8000/api/calls/book-call/', bookingData)
        .subscribe({
          next: (res: any) => {
            alert(`Booking confirmed for ${bookingData.date} at ${bookingData.time}`);
            this.showForm = false;
            this.bookingForm.reset({ gender: 'Male' });
          },
          error: (err) => {
            if (err.status === 409) {
              alert('This time slot is already booked.');
            } else {
              alert('An error occurred. Please try again.');
            }
            console.error(err);
          }
        });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.bookingForm.reset({ gender: 'Male' });
  }
}
