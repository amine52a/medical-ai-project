import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isMenuCollapsed = true;
  currentYear = new Date().getFullYear();
  
  // For appointment form
  appointmentForm!: FormGroup;
  
  services = [
    { id: 1, name: 'Select service' },
    { id: 2, name: 'General Checkup' },
    { id: 3, name: 'Dental Care' }
  ];

  times = [
    { value: '1', display: '8 AM TO 10AM' },
    { value: '2', display: '10 AM TO 12PM' }
  ];

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      service: ['', Validators.required],
      time: ['', Validators.required],
      note: ['']
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      console.log('Form submitted:', this.appointmentForm.value);
      // Add your form submission logic here
    }
  }
}