import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { ContactComponent } from "./contact/contact.component";
import { FooterComponent } from "./footer/footer.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { PriceComponent } from "./price/price.component";
import { ServiceComponent } from "./service/service.component";
import { BookingComponent } from "./booking/booking.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HomeComponent, AboutComponent, ContactComponent, FooterComponent, GalleryComponent, PriceComponent, ServiceComponent , BookingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HairPilot';
}
