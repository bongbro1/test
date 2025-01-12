import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet],
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'MobilePhoneSalesManagement_Frontend';  // Thuộc tính mẫu cho component
}