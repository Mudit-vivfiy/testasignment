import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token = new Subject<any>();
  constructor(private http: HttpClient) { }

  userById(id: number) {
    return this.http.get(`${environment.baseUrl}/userbyid/${id}`);
  }
  addUser(data: any) {
    return this.http.post(`${environment.baseUrl}/create`, data);
  }
  updateUser(data: any) {
    return this.http.post(`${environment.baseUrl}/update`, data);
  }
  deleteUser(id: number) {
    return this.http.get(`${environment.baseUrl}/delete/${id}`);
  }
  getAllUser() {
    return this.http.get(`${environment.baseUrl}/getalluser`);
  }
  login(data: any) {
    return this.http.post(`${environment.baseUrl}/login`, data);
  }
}
