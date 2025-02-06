import { Component, OnInit } from '@angular/core';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LecturerDashboardComponent } from "../lecturer-dashboard/lecturer-dashboard.component";
import { helperService } from 'app/core/auth/helper';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminDashboardComponent, CarouselModule, LecturerDashboardComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  _userAccount: any;
  showAdminDashboard: boolean = false;
  showLecturerDashboard: boolean = false;
  constructor(private _helperService: helperService) {

  }
  ngOnInit(): void {
    this._userAccount = this._helperService.getUserDetail();
    this.showAdminDashboard = this._userAccount.Roles === 'CollegeAdministrator';
    this.showLecturerDashboard = this._userAccount.Roles === 'Lecturer';
  }
}
