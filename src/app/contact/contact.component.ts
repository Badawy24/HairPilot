import { Component,Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { HeaderpageComponent } from '../headerpage/headerpage.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule , FooterComponent,HeaderpageComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  successMessage = '';
  errorMessage = '';
  isSending = false;

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.isSending = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = this.contactForm.value;

    const apiUrl = 'https://your-backend-api.com/contact';

    this.http.post(apiUrl, formData).subscribe({
      next: () => {
        this.successMessage = 'Sent!';
        this.contactForm.reset();
        this.isSending = false;
      },
      error: () => {
        this.errorMessage = 'Error!';
        this.isSending = false;
      }
    });

  }
  @Input() showHeader = true;
}
