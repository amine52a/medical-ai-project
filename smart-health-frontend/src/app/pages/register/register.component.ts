import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitMessage: string = '';
  submitSuccess: boolean = false;
  showPopup: boolean = false;

  private apiUrl = 'http://localhost:8000';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(10), Validators.max(120)]],
      gender: ['', Validators.required],
      weight: [''],
      height: [''],
      country: [''],
      mentalGoals: [''],
      conditions: [''],
      contactMethod: ['email'],
      acceptPrivacy: [false, Validators.requiredTrue]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

 onSubmit() {
  if (this.registerForm.invalid) return;

  const rawData = this.registerForm.value;
  const data = {
    username: rawData.email,
    email: rawData.email,
    password: rawData.password,
    confirmPassword: rawData.confirmPassword,  // ✅ included
    full_name: rawData.fullName,
    age: rawData.age ? Number(rawData.age) : null,
    weight: rawData.weight ? Number(rawData.weight) : null,
    height: rawData.height ? Number(rawData.height) : null,
    gender: rawData.gender,
    country: rawData.country,
    mental_goals: rawData.mentalGoals,
    conditions: rawData.conditions,
    contact_method: rawData.contactMethod,
    accept_privacy: Boolean(rawData.acceptPrivacy)
  };

  this.http.post(`${this.apiUrl}/api/accounts/register/`, data).subscribe({
    next: (res) => {
      console.log('Backend response:', res); // ✅ optional for debugging
      this.submitSuccess = true;
      this.submitMessage = 'Registration successful!';
      this.showPopup = true;

      setTimeout(() => {
        this.showPopup = false;
        this.router.navigate(['/']);
      }, 2500);
    },
    error: (err) => {
      console.error('Registration error:', err); // ✅ see backend validation errors
      this.submitSuccess = false;
      // Show backend error if exists
      if (err.error && err.error.error) {
        this.submitMessage = `Registration failed: ${err.error.error}`;
      } else {
        this.submitMessage = 'Registration failed, please try again.';
      }
      this.showPopup = true;

      setTimeout(() => this.showPopup = false, 2500);
    }
  });
}

}
