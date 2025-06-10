import { Component } from '@angular/core';
import { AboutComponent } from "../about/about.component";
import { ServiceComponent } from "../service/service.component";
import { PriceComponent } from "../price/price.component";
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, ServiceComponent, PriceComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
