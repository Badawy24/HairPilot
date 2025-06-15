import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  form!: FormGroup;
  availableSlots: string[] = [];
  bookedSlots: string[] = [];

  constructor(private firestore: Firestore, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.generateTimeSlots();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      date: ['', Validators.required],
      slot: ['', Validators.required],
    });
  }

  onDateChange() {
    let date = this.form.get('date')?.value;
    if (date) this.getBookedSlots(date);
  }

  generateTimeSlots() {
    let slots: string[] = [];
    for (let hour = 9; hour <= 22; hour++) {
      slots.push(this.formatTime(hour, 0));
      slots.push(this.formatTime(hour, 30));
    }
    this.availableSlots = slots;
  }

  formatTime(hour: number, minute: number): string {
    let suffix = hour >= 12 ? "PM" : "AM";
    let formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    let formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${suffix}`;
  }

  async getBookedSlots(date: string) {
    let bookingsRef = collection(this.firestore, 'bookings');
    let q = query(bookingsRef, where("date", "==", date));
    let snapshot = await getDocs(q);
    this.bookedSlots = snapshot.docs.map(doc => doc.data()['time'] + '|' + date);
  }

  isSlotAvailable(slot: string): boolean {
    let date = this.form.get('date')?.value;
    if (!date) return true;
    return !this.bookedSlots.includes(slot + '|' + date);
  }

  suggestBestTime() {
    let date = this.form.get('date')?.value;
    if (!date) {
      alert("Please select a date first");
      return;
    }

    let unbooked = this.availableSlots.filter(slot => this.isSlotAvailable(slot));
    if (unbooked.length === 0) {
      alert("No available slots on this date ❌");
      return;
    }

    this.form.patchValue({ slot: unbooked[0] });
    alert(`Best available time suggested: ${unbooked[0]} ✅`);
  }

  async bookSlot() {
    if (this.form.invalid) {
      alert("Please fill in all fields correctly.");
      return;
    }

    let { name, phone, date, slot } = this.form.value;

    let today = new Date();
    let selected = new Date(date);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      alert("You cannot select a past date ❌");
      return;
    }

    if (selected.getDay() === 1) {
      alert("Appointments are not allowed on Mondays ❌");
      return;
    }

    let bookingsRef = collection(this.firestore, 'bookings');
    let q = query(bookingsRef, where("date", "==", date), where("time", "==", slot));
    let querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      alert("This slot is already booked ❌");
      this.getBookedSlots(date);
      return;
    }

    await addDoc(bookingsRef, {
      customername: name,
      phone,
      date,
      time: slot,
      createdAt: new Date()
    });

    alert("Booking confirmed successfully ✅");
    this.form.reset();
    this.bookedSlots = [];
  }
}
