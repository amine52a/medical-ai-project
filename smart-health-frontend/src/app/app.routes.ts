// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SymptomCheckerComponent } from './symptom-checker/symptom-checker.component'; // <-- import the new component
import { VoiceChatComponent } from './voice-chat/voice-chat.component'; // <-- import the new component
import { BookACallComponent } from './pages/book-a-call/book-a-call.component'; // <-- import the new component
import { ContactComponent } from './pages/contact/contact.component'; // <-- import the new component
import { AboutComponent } from './pages/about/about.component'; // <-- import the new component
import { LoginComponent } from './pages/login/login.component'; // <-- import the new component
import { RegisterComponent } from './pages/register/register.component'; // <-- import the new component

export const routes: Routes = [
  { path: '', component: HomeComponent },
    { path: 'symptom-checker', component: SymptomCheckerComponent },  // <-- new route here
    { path: 'Voice-chat', component: VoiceChatComponent },
        { path: 'Call', component: BookACallComponent },  // <-- new route here
        { path: 'Contact', component: ContactComponent },  // <-- new route here
        { path: 'about', component: AboutComponent },  // <-- new route here
        { path: 'login', component: LoginComponent },  // <-- new route here
        { path: 'register', component: RegisterComponent },  // <-- new route here

  { path: '**', redirectTo: '' }
];
