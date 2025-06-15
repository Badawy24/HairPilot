import { Component } from '@angular/core';
import { AboutComponent } from "../about/about.component";
import { ServiceComponent } from "../service/service.component";
import { PriceComponent } from "../price/price.component";
import { ContactComponent } from "../contact/contact.component";
import { BookingComponent } from "../booking/booking.component";

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, ServiceComponent, PriceComponent, ContactComponent, BookingComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
