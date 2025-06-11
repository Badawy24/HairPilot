import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
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
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  availableSlots: string[] = [];
  bookedSlots: string[] = [];
  selectedSlot: string = '';

  customerName: string = '';
  customerPhone: string = '';
  selectedDate: string = '';

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.generateTimeSlots();
  }

  onDateChange() {
    this.getBookedSlots();
  }

  generateTimeSlots() {
    const slots: string[] = [];
    for (let hour = 9; hour <= 22; hour++) {
      slots.push(this.formatTime(hour, 0));
      slots.push(this.formatTime(hour, 30));
    }
    this.availableSlots = slots;
  }

  formatTime(hour: number, minute: number): string {
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${suffix}`;
  }

  getBookedSlots() {
    if (!this.selectedDate) return;

    const bookingsRef = collection(this.firestore, 'bookings');
    const q = query(bookingsRef, where("date", "==", this.selectedDate));

    getDocs(q).then(snapshot => {
      this.bookedSlots = snapshot.docs.map(doc => doc.data()['time'] + '|' + this.selectedDate);
    });
  }

  isSlotAvailable(slot: string): boolean {
    if (!this.selectedDate) return true;
    const key = slot + '|' + this.selectedDate;
    return !this.bookedSlots.includes(key);
  }

  async bookSlot() {
    if (!this.customerName || !this.customerPhone || !this.selectedDate || !this.selectedSlot) {
      alert("Please fill in all fields.");
      return;
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(this.customerPhone)) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }

    const today = new Date();
    const selected = new Date(this.selectedDate);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      alert("You cannot select a past date ❌");
      return;
    }

    const selectedDay = selected.getDay(); // 1 is Monday
    if (selectedDay === 1) {
      alert("Appointments are not allowed on Mondays ❌");
      return;
    }

    const bookingsRef = collection(this.firestore, 'bookings');
    const q = query(
      bookingsRef,
      where("date", "==", this.selectedDate),
      where("time", "==", this.selectedSlot)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      alert("This slot is already booked ❌");
      this.getBookedSlots(); // إعادة التحقق مباشرة بعد الفشل
      return;
    }

    await addDoc(bookingsRef, {
      customername: this.customerName,
      phone: this.customerPhone,
      date: this.selectedDate,
      time: this.selectedSlot,
      createdAt: new Date()
    });

    alert("Booking confirmed successfully ✅");
    this.selectedSlot = '';
    this.customerName = '';
    this.customerPhone = '';
    this.selectedDate = '';
    this.bookedSlots = [];
  }
}
