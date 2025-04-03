import { Component, OnInit } from '@angular/core';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LecturerDashboardComponent } from "../lecturer-dashboard/lecturer-dashboard.component";
import { helperService } from 'app/core/auth/helper';
import { CommonModule } from '@angular/common';
import { StudentDashboardComponent } from '../student-dashboard/student-dashboard.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminDashboardComponent, CarouselModule, LecturerDashboardComponent, CommonModule, StudentDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  _userAccount: any;
  showAdminDashboard: boolean = false;
  showLecturerDashboard: boolean = false;
  showStudentDashboard: boolean = false;
  constructor(private _helperService: helperService) {

  }
  ngOnInit(): void {
    this._userAccount = this._helperService.getUserDetail();
    this.showAdminDashboard = this._userAccount.Roles === 'CollegeAdministrator' || this._userAccount.Roles === 'HOD';
    this.showLecturerDashboard = this._userAccount.Roles === 'Lecturer';
    this.showStudentDashboard = this._userAccount.Roles === 'Student';
  }
}
