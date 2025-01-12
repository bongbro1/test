import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { UserAddComponent } from "./user-add/user-add.component";
import { error } from 'jquery';
declare var $: any;


@Component({
  selector: 'app-user-management',
  imports: [CommonModule, UserAddComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {

  currentPage: number = 1;
  totalPages: number = 1; 
  pageSize: number = 10;   
  totalCount: number = 0;  
  users: any[] = [];       
  pages: number[] = [];    
  searchKey: string = ''; 
  lastActiveDays: number = 0;
  selectedUserIds: number[] = []; // Danh sách các userId đã chọn
  allSelected: boolean = false;   // Biến kiểm tra "Check all"
  // pagination
  showEllipsisBefore: boolean = false;
  showEllipsisAfter: boolean = false;
  // block, unblock modal
  isModalOpen = false; // Trạng thái mở modal
  selectedUser: any = null; // User được chọn
  action: 'block' | 'unblock' = 'block'; // Hành động (block/unblock)

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    // Cập nhật danh sách các trang hiển thị
    this.updatePagination();
  }

  // Gọi API để load danh sách người dùng
  loadUsers(): void {
    // Gọi API để lấy dữ liệu phân trang
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        
        this.users = data.items || [];

        // Lọc dữ liệu nếu có tìm kiếm
        if (this.searchKey) {
          this.users = this.users.filter(
            (user) =>
              user.email?.includes(this.searchKey) ||
              user.phone?.includes(this.searchKey)
          );
        }

        // Lọc theo ngày hoạt động gần đây nếu có
        if (this.lastActiveDays > 0) {
          this.users = this.users.filter((user) =>
            this.checkLastActive(user.lastOnlineAt, this.lastActiveDays)
          );
        }

        // Cập nhật phân trang
        this.totalCount = data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        
        
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  // Cập nhật danh sách các trang cần hiển thị
  updatePagination(): void {
    // Xác định nếu cần hiển thị dấu '...'
    this.showEllipsisBefore = this.currentPage > 2;
    this.showEllipsisAfter = this.currentPage < this.totalPages - 1;
  }

  // Điều hướng tới trang tiếp theo
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();  // Cập nhật lại phân trang
      this.loadUsers();  // Gọi lại phương thức tải dữ liệu (nếu cần)
    }
  }

  // Điều hướng tới trang trước
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();  // Cập nhật lại phân trang
      this.loadUsers();  // Gọi lại phương thức tải dữ liệu (nếu cần)
    }
  }

  // Thay đổi số trang hiển thị mỗi trang
  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Ép kiểu sang HTMLSelectElement
    this.pageSize = parseInt(target.value, 10);
    this.currentPage = 1; // Đặt lại về trang đầu khi thay đổi số lượng trang
    this.loadUsers();
  }

  // Thay đổi ngày hoạt động gần đây
  onLastActiveChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.lastActiveDays = parseInt(target.value, 10);
    this.currentPage = 1; // Đặt lại về trang đầu khi thay đổi bộ lọc
    this.loadUsers();
  }

  // Thay đổi từ khóa tìm kiếm
  onSearchKeyChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchKey = target.value;
    this.currentPage = 1; // Đặt lại về trang đầu khi thay đổi từ khóa tìm kiếm
    this.loadUsers();
  }

  // Kiểm tra ngày hoạt động gần đây
  checkLastActive(lastActiveDate: string, days: number): boolean {
    const lastActive = new Date(lastActiveDate);    
    const diff = new Date().getTime() - lastActive.getTime();
    const daysDifference = diff / (1000 * 3600 * 24); // Tính số ngày
    
    console.log(daysDifference);
    return daysDifference >= days;
  }

  // Khi "Check all" thay đổi
  selectAll(event: Event): void {
    this.allSelected = (event.target as HTMLInputElement).checked;
    if (this.allSelected) {
      this.selectedUserIds = this.users.map(user => user.userId);
    } else {
      this.selectedUserIds = [];
    }
  }

  // Kiểm tra xem checkbox có được chọn không
  isChecked(userId: number): boolean {
    return this.selectedUserIds.includes(userId);
  }

  // Khi checkbox trong một hàng thay đổi
  toggleSelection(userId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedUserIds.push(userId);
    } else {
      const index = this.selectedUserIds.indexOf(userId);
      if (index !== -1) {
        this.selectedUserIds.splice(index, 1);
      }
    }
    this.allSelected = this.selectedUserIds.length === this.users.length;
    
    // Nếu có một item bị bỏ chọn, đánh dấu "Check all" là không chọn
    if (!this.allSelected) {
      this.allSelected = false;
    }
    
  }

  openModal(user: any, action: 'block' | 'unblock'): void {
    this.selectedUser = user;
    this.action = action;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  confirmAction(): void {
    this.userService.toggleBlockUser(this.selectedUser.userId).subscribe(
      () => {
        alert('User đã bị chặn thành công');
        this.loadUsers();
      },
      (error) => {
        console.error('Lỗi khi chặn user:', error);
        alert('Không thể chặn user. Vui lòng thử lại sau.');
      }
    );
    this.closeModal();
  }


  // block, unblock nhiều user
  blockOrUnblockSelectedUsers(): void {
    if (this.selectedUserIds.length === 0) {
      alert('Vui lòng chọn ít nhất một user.');
      return;
    }
    this.userService.toggleBlockUsers(this.selectedUserIds).subscribe(
      (res) => {
        alert('Cập nhật trạng thái thành công');
        this.loadUsers();
      },
      (error) => {
        console.error(error);
      }
    )
  }

  // Mở modal cho Add hoặc Edit
  openUserModal(user: any = null) {
    this.selectedUser = user ? { ...user } : {}; // Nếu chỉnh sửa thì copy dữ liệu, nếu thêm mới thì object rỗng
    const modal: any = document.getElementById('userModal');
    $(modal).modal('show');
  }
  closeUserModal() {
    const modal: any = document.getElementById('userModal');
    $(modal).modal('hide'); // Đóng modal
  }
}
