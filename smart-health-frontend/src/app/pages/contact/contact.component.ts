import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from "../../components/header/header.component";

interface ContactResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  contactInfo = {
    address: {
      title: 'Medical Center Location',
      details: 'Main Street Medical District, City Center'
    },
    phone: {
      number: '00 (440) 9865 562',
      hours: 'Mon to Fri 9am to 6pm'
    },
    email: {
      address: 'info@medicalcenter.com',
      note: 'Send us your query anytime!'
    }
  };

  private apiUrl = 'http://localhost:8000/api/contact/'; // <-- Django API endpoint

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';

    const contactData = this.contactForm.value;

    this.http.post<ContactResponse>(this.apiUrl, contactData).subscribe({
      next: (res) => {
        this.submitSuccess = res.success;
        this.submitMessage = res.message;
        if (res.success) {
          this.contactForm.reset();
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.submitSuccess = false;
        this.submitMessage = 'Sorry, there was an error sending your message. Please try again.';
        this.isSubmitting = false;
        console.error('Contact form error:', err);
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.capitalizeFirst(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength'])
        return `${this.capitalizeFirst(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
