import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  imports: [FormsModule],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {
  user = {
    email: '',
    passwordHash: '',
    status: true,
    role: 'client',
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    address: '',
    phoneNumber: '',
    lastOnlineAt: new Date()
  };  

  constructor(private userService: UserService) {}

  ngOnInit() {
    const currentDate = new Date();
    this.user.dateOfBirth = currentDate.toISOString().split('T')[0];  // Chuyển đổi sang định dạng yyyy-mm-dd
  }

  submitForm() {
    if (!this.user.email || !this.user.passwordHash || !this.user.fullName || !this.user.dateOfBirth || !this.user.phoneNumber) {
      alert("Vui lòng nhập đủ thông tin yêu cầu!");
      return;
    }

    this.userService.addUser(this.user).subscribe(
      (response) => {
        alert ("Thêm người dùng thành công!");
        window.location.reload();
      },
      (error) => {
        alert(error.error.message)
      }
    );
  }
}
