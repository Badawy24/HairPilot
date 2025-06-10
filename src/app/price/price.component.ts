import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css'],
  imports: [CommonModule, RouterModule]
})
export class PriceComponent {
  priceItems = [
    { title: 'Hair Cut', price: '$9.99', image: 'assets/img/price-1.jpg' },
    { title: 'Hair Wash', price: '$10.99', image: 'assets/img/price-2.jpg' },
    { title: 'Hair Color', price: '$11.99', image: 'assets/img/price-3.jpg' },
    { title: 'Hair Shave', price: '$12.99', image: 'assets/img/price-4.jpg' },
    { title: 'Hair Straight', price: '$13.99', image: 'assets/img/price-5.jpg' },
    { title: 'Facial', price: '$14.99', image: 'assets/img/price-6.jpg' },
    { title: 'Shampoo', price: '$15.99', image: 'assets/img/price-7.jpg' },
    { title: 'Beard Trim', price: '$16.99', image: 'assets/img/price-8.jpg' },
    { title: 'Beard Shave', price: '$17.99', image: 'assets/img/price-9.jpg' },
    { title: 'Wedding Cut', price: '$18.99', image: 'assets/img/price-10.jpg' },
    { title: 'Clean Up', price: '$19.99', image: 'assets/img/price-11.jpg' },
    { title: 'Massage', price: '$20.99', image: 'assets/img/price-12.jpg' }
  ];
}
