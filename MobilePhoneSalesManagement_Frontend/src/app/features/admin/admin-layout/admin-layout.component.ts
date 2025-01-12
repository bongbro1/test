import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../core/components/admin/navbar/navbar.component';


@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
