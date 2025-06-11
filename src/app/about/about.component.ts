import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderpageComponent } from '../headerpage/headerpage.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, CommonModule, HeaderpageComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  @Input() showHeader = true;
}

