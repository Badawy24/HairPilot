import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headerpage',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './headerpage.component.html',
  styleUrl: './headerpage.component.css'
})
export class HeaderpageComponent {
  @Input() titleOfPage: string = "";
  @Input() link: string = "";
}
