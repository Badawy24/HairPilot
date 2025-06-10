import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule , FooterComponent],
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

    // حط هنا رابط الـ API لما تكون جاهز
    const apiUrl = 'https://your-backend-api.com/contact';

    this.http.post(apiUrl, formData).subscribe({
      next: () => {
        this.successMessage = 'تم إرسال الرسالة بنجاح.';
        this.contactForm.reset();
        this.isSending = false;
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.';
        this.isSending = false;
      }
    });

    // أو استخدم محاكاة لو لسه مفيش API:
    /*
    setTimeout(() => {
      this.successMessage = 'تم إرسال الرسالة بنجاح (محاكاة).';
      this.contactForm.reset();
      this.isSending = false;
    }, 1000);
    */
  }
}
