import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderpageComponent } from '../headerpage/headerpage.component';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [RouterLink,HeaderpageComponent],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
  @Input() showHeader = true;
}
