import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexOptions, ApexPlotOptions, ApexXAxis, NgApexchartsModule } from 'ng-apexcharts';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DashboardService } from '../dashboard.service';
import { studentExamSummaryGrid } from '../../common/gridFilter';
import { helperService } from 'app/core/auth/helper';
export type linearChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [MatTableModule, CarouselModule, CommonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatChipsModule, NgApexchartsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent  implements OnInit {
  public linearChartOptions: ApexOptions = {};
  assignedTeams:any=[];
  // assignedTeams = [
  //   {
  //     code: 'A1-M1',
  //     mentors: [
  //       { name: 'Dr. Anil Rao', role: 'Mentor 1', photoUrl: 'assets/anil.jpg' },
  //     ],
  //     lecturers: [
  //       { name: 'Prof. Rakesh Patil', subject: 'Emergency Medicine', photoUrl: 'assets/rakesh.jpg' }
  //     ]
  //   },
  //   {
  //     code: 'A2-M1',
  //     mentors: [
  //       { name: 'Dr. Priya Sharma', role: 'Mentor 1', photoUrl: 'assets/priya.jpg' }
  //     ],
  //     lecturers: [
  //       { name: 'Dr. Sameer Khan', subject: 'Public Health', photoUrl: 'assets/sameer.jpg' }
  //     ]
  //   }
  // ];
  _studentUpcomingExam: any = [];
  _userAccount: any;
  dataSource = new MatTableDataSource<any>();
  columns: string[] = ['ExamName', 'Subjects', 'No.Quest', 'Score', 'Rank', 'Status'];
  constructor(private _dashBoard: DashboardService, private _helperService: helperService) { }
  ngOnInit(): void {
    this._userAccount = this._helperService.getUserDetail();
    const studentExamSummary: studentExamSummaryGrid = {
      keyword: '',
      pageNumber: 1,
      pageSize: 10,
      orderBy: '',
      sortOrder: 'desc',
      userId: '',   
      attendenceStatus: 2
    };
    this._dashBoard.getStudentExamSummaryGrid(studentExamSummary).subscribe((response: any) => {
      this.dataSource = response.data;
    });
    this._dashBoard.getAssignedTeamDetails().subscribe((response: any) => {
      this.assignedTeams = response;
    });
    this._dashBoard.getStudentiUpcomingExam().subscribe((response: any) => {
      this._studentUpcomingExam = response;


    });
    this.fetchChartData();
  }

  getTimeRemaining(seconds: number): string {


    if (typeof seconds !== 'number' || isNaN(seconds)) {
      console.error('Invalid input for getTimeRemaining:', seconds);
      return 'Invalid Time';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);



    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMins = minutes.toString().padStart(2, '0');

    const result = `${formattedHours}:${formattedMins} Hrs`;


    return result;
  }




  // chart
  fetchChartData() {
    this._dashBoard.getStudentSubjectWiseAvgMarks().subscribe((response: any) => {
      const categories = response.map((item: any) => item.subjectName);
      const colors = ["#7EE8CA", "#9BD7FF", "#FFB6C1", "#FFA07A", "#FFD700", "#8A2BE2", "#32CD32"]; // Different colors

      const dataSeries = response.map((item: any, index: number) => ({
        x: item.subjectName,
        y: item.averageMarks,
        fillColor: colors[index % colors.length] // Assign different colors cyclically
      }));

      this.linearChartOptions = {
        series: [{ name: "Progress", data: dataSeries }],
        grid: {
          row: {
            colors: ["transparent", "transparent"],
            opacity: 0.5
          },
          padding: {
            left: 0,
            right: 0
          }
        },
        chart: {
          type: "bar",
          height: 270,
          // width: 1000,
          offsetY: -10
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: { position: "top" },
            barHeight: "10%"
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: 25,
          style: {
            fontSize: "12px",
            colors: ["#505050"]
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories,
          labels: { show: false } // Hide x-axis labels (count)
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "12px",
              colors: "#000"
            }
          }
        }
      };
    });
  }

}
