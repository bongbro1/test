import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { BASE_URL_API } from '../../../../app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Phương thức lấy danh sách người dùng
  getUsers(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${BASE_URL_API}/users?pageNumber=${page}&pageSize=${pageSize}`);
  }

  // Phương thức lấy thông tin một người dùng theo ID
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${BASE_URL_API}/users/${userId}`);
  }

  // Phương thức thêm mới người dùng
  addUser(user: any): Observable<any> {
    return this.http.post(`${BASE_URL_API}/users`, user);
  }

  // Phương thức cập nhật thông tin người dùng
  updateUser(userId: string, user: any): Observable<any> {
    return this.http.put(`${BASE_URL_API}/users/${userId}`, user);
  }

  // Phương thức xóa người dùng
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${BASE_URL_API}/users/${userId}`);
  }
  // Xóa người dùng theo danh sách ID
  deleteUsersByIdList(userIds: number[]): Observable<any> {
    return this.http.delete(`${BASE_URL_API}/users/delete-users-by-id-list`, {
      body: userIds,
    });
  }

  // Lọc người dùng theo số ngày hoạt động gần đây
  filterByLastActive(days: number): Observable<any> {
    return this.http.get(`${BASE_URL_API}/users/filter-by-last-active/${days}`);
  }

  // Lọc người dùng theo từ khóa tìm kiếm
  filterByKeySearch(query: string): Observable<any> {
    return this.http.get(`${BASE_URL_API}/users/filter-search/${query}`);
  }

  toggleBlockUser(userId: number): Observable<any> {
    return this.http.post<any>(`${BASE_URL_API}/users/toggle-block/${userId}`, null);
  }
  toggleBlockUsers(userIds: number[]): Observable<any> {
    return this.http.post(`${BASE_URL_API}/users/toggle-block-users`, userIds);
  }
}
