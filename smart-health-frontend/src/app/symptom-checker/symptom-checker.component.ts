import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../components/header/header.component';

interface Prediction {
  disease: string;
  confidence: number;
}

@Component({
  selector: 'app-symptom-checker',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule,
    HeaderComponent,
    
  ],
  templateUrl: './symptom-checker.component.html',
  styleUrls: ['./symptom-checker.component.css']
})
export class SymptomCheckerComponent {
  symptomInput: string = '';
  predictions: Prediction[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.error = null;
    if (!this.symptomInput.trim()) {
      this.error = 'Please enter some symptoms.';
      return;
    }

    this.loading = true;
    this.predictions = [];

    const symptomsArray = this.symptomInput.split(',').map(s => s.trim().toLowerCase());

    this.http.post<{ predictions: Prediction[] }>('http://127.0.0.1:8000/api/symptom/check/', { symptoms: symptomsArray })
      .subscribe({
        next: (response) => {
          this.predictions = response.predictions;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error occurred while checking symptoms.';
          this.loading = false;
          console.error(err);
        }
      });
  }
}