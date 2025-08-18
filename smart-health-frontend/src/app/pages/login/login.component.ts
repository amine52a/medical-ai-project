// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  submitSuccess: boolean = false;
  submitMessage: string = '';
  showPopup: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post<any>('http://localhost:8000/api/accounts/login/', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);

        this.submitSuccess = true;
        this.submitMessage = 'Login successful! Redirecting...';
        this.showPopup = true;
        this.error = '';

        setTimeout(() => {
          this.showPopup = false;
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        this.submitSuccess = false;
        this.submitMessage = err.error?.message || 'Invalid credentials';
        this.showPopup = true;
        this.error = this.submitMessage;
        
        setTimeout(() => {
          this.showPopup = false;
        }, 2000);
      }
    });
  }
}