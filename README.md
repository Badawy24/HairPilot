# HairPilot - AI Powered Haircut Suggestion & Booking System

HairPilot is an Angular standalone project designed to help users find their **perfect haircut** using AI-powered **face shape detection**. The project combines AI with practical salon functionalities such as online **appointment booking**, a **service gallery**, and **contact forms**.

---

## 🌟 Features

### ✅ Face Shape Detection

* Upload an image to detect face shape using **face-api.js**
* Face landmarks are drawn on a canvas overlay
* Supported shapes: `Square`, `Diamond`, `Heart`, `Oblong`, `Oval`, `Round`
* Each detected face shape generates **3 hairstyle suggestions** with real images

### ✅ Booking System

* Booking appointments stored in **Firebase Firestore**
* Auto-suggests best available time slots
* Validation for:

  * Required fields
  * Phone number format (11 digits)
  * No bookings allowed for past dates or Mondays

### ✅ UI Pages

* Home, About, Services, Prices, Gallery, Contact
* Responsive Design, Clean & Organized

### ✅ Gallery

* Interactive filtering for gallery items

### ✅ Routing

* Angular Standalone Routing with **NotFound** fallback route

---

## 🚀 Tech Stack

| Tech           | Usage                                  |
| -------------- | -------------------------------------- |
| Angular 17     | Main framework (Standalone Components) |
| face-api.js    | Face shape detection                   |
| Firebase       | Firestore for Booking storage          |
| Bootstrap/CSS  | Responsive UI styling                  |
| Reactive Forms  | Contact form handling                  |
| Angular Router | SPA Navigation                         |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home.component.ts
│   │   ├── about.component.ts
│   │   ├── service.component.ts
│   │   ├── gallery.component.ts
│   │   ├── face.component.ts       // AI Detection UI
│   │   ├── booking.component.ts    // Booking logic with Firestore
│   │   ├── contact.component.ts    // Contact Form
│   │   └── notfound.component.ts
│   ├── services/
│   │   └── face-ai.service.ts      // Face detection logic
│   └── routes.ts
└── assets/
    └── models/                     // face-api models
    └── result/                     // Suggested haircut images
    └── enviroments/                // Connect With Firebase
```

---

## ⚙️ Installation & Running Locally

1️⃣ Install dependencies:

```bash
npm install
npm install firebase
```

2️⃣ Serve the app:

```bash
ng serve
```

3️⃣ Firebase Setup:

* Configure Firestore rules
* Add Firebase configuration to environment

---

## 🔑 Environment Variables Example

```ts
export const environment = {
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
```

---

## 📌 Notes

* **face-api.js models** should be downloaded and placed in `assets/models/`

---

## ✨ Contribution & License

* Built for educational and demo purposes
* Contributions and improvements welcome!

> **Developed by** Abdelrahman Badawy & Mahmoud Shalaby
