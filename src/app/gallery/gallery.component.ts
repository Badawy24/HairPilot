// gallery.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})

  export class GalleryComponent {
  activeFilter = '*';

  galleryItems = [
    { src: 'assets/img/portfolio-1.jpg', category: 'third' },  // Hair Cut
    { src: 'assets/img/portfolio-2.jpg', category: 'first' }, // Beard Style
    { src: 'assets/img/portfolio-3.jpg', category: 'first' },  // Color & Wash
    { src: 'assets/img/portfolio-4.jpg', category: 'first' },
    { src: 'assets/img/portfolio-5.jpg', category: 'second' },
    { src: 'assets/img/portfolio-6.jpg', category: 'second' },
  ];

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  isVisible(category: string): boolean {
    return this.activeFilter === '*' || this.activeFilter === category;
  }
}


