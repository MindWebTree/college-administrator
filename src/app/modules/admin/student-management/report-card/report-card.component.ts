import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexOptions, ApexPlotOptions, ApexXAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { Location } from '@angular/common';
import { studentAnalytics, studentModel, StudentReportCard } from '../student-management.model';
import { StudentService } from '../student-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { studentAnalyticGrid } from '../../common/gridFilter';
import { CreateStudentComponent } from '../create-student/create-student.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
export type linearChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

export interface PeriodicElement {
  date: string;
  examname: string;
  subject: string;
  rank: number;
  avgscore: string;
  result: string;
}

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatChipsModule, NgApexchartsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.scss'
})
export class ReportCardComponent {
  students: studentModel;
  userId: string;
  studentReportCardDetails: StudentReportCard;
  //  = {
  //   firstName: '',
  //   lastName: '',
  //   courseId:0,
  //   imageUrl: '',
  //   rollNo: '',
  //   averageMarks: 0,
  //   noOfExamsAssigned: '',
  //   noOfExamsAdmitted: '',
  //   noOfAwards: '',
  //   phoneNumber: '',
  //   email: '',
  //   id: 0,
  //   userID: '',
  //   isActive: true,
  //   isDeleted: false,
  //   updatedBy: '',
  //   createdBy: '',
  //   createdOn: '',
  //   updatedOn: '',
  //   courses: []
  // };
  examAnalyticsListing: any
  displayedColumns: string[] = ['date', 'examname', 'subject', 'rank', 'avgscore', 'result'];
  dataSource: any = [];

  attendedExamsDataSource: any[] = [];
  nonAttendedExamsDataSource: any[] = [];
  @ViewChild("linearchart") linearChart: ChartComponent;
  public linearChartOptions: ApexOptions = {};



  @ViewChild('dialogContent', { static: true })
  dialogContent: TemplateRef<any>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  dialogRef: any;
  constructor(private _location: Location, public _matDialog: MatDialog, private _studentService: StudentService, private route: ActivatedRoute, private router: Router) {

    this.route.params.subscribe((parram) => {

      this.userId = parram.userId;

    });

    this.linearChartOptions = {


      series: [
        {
          name: "Progress",
          data: [
            {
              x: "Anatomy",
              y: 98,
              fillColor: "#7EE8CA"

            },
            {
              x: "Chemistry",
              y: 84,
              fillColor: "#7EE8CA"
            }

            , {
              x: "Pediatrics",
              y: 78,
              fillColor: "#9BD7FF"
            }, {
              x: "Dermatolog",
              y: 74,
              fillColor: "#9BD7FF"
            }
            , {
              x: "Pediatrics",
              y: 60,
              fillColor: "#FFDA9B"
            }, {
              x: "Dermatolog",
              y: 52,
              fillColor: "#FFDA9B"
            }
            , {
              x: "Pediatrics",
              y: 41,
              fillColor: "#FFDA9B"
            }, {
              x: "Dermatolog",
              y: 32,
              fillColor: "#FFB9AD"
            }
            , {
              x: "Pediatrics",
              y: 21,
              fillColor: "#FFB9AD"
            }, {
              x: "Dermatolog",
              y: 20,
              fillColor: "#FFB9AD"
            }
          ]
        }
      ],
      grid: {

        show: false,  // This removes the grid

        // row: {
        //   colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
        //   opacity: 0.5
        // },
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      chart: {
        type: "bar",
        height: 350,
        // width: 1000,
        offsetY: -10,
        toolbar: {
          show: false
        },

      },

      plotOptions: {
        bar: {
          horizontal: true,

          dataLabels: {
            position: "top"
          },
          barHeight: "45%",
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: 25,
        formatter: function (val) {
          return val + "%";
        },
        style: {
          fontSize: "10px",
          colors: ["#505050"]
        }
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent']  // Change to transparent
      },
      xaxis: {
        axisBorder: {
          show: false // Hides the x-axis border
        },
        axisTicks: {
          show: false // Hides the x-axis ticks
        },
        categories: [
          "Anatomy",
          "Chemistry",
          "Pediatrics",
          "Dermatolog",
          "Pharmacology",
          "ENT",
          "Orthopedics",
          "Medicine",
          "Physicology",
          "FM"
        ],
        labels: {
          show: false // Hides the x-axis tick labels (numbers)
        }
      },
      yaxis: {
        labels: {
          show: true,  // Keep the labels visible
          style: {
            colors: '#000000'  // You can adjust the color
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },

    };

  }

  ngOnInit(): void {

    this.getStudeDetails();

    // Define filter objects
    const attendedExamFilter: studentAnalyticGrid = {
      keyword: '',
      pageNumber: 1,
      pageSize: 10,
      orderBy: '',
      sortOrder: 'desc',
      attendenceStatus: studentAnalytics.attendedExam,
      userId: this.userId
    };

    const nonAttendedExamFilter: studentAnalyticGrid = {
      keyword: '',
      pageNumber: 1,
      pageSize: 10,
      orderBy: '',
      sortOrder: 'desc',
      attendenceStatus: studentAnalytics.nonAttendedExam,
      userId: this.userId
    };

    // Fetch attended exams
    this._studentService.studentExamAnalyticsListing(attendedExamFilter).subscribe((response: any) => {
      this.attendedExamsDataSource = response.data;
    });

    // Fetch non-attended exams
    this._studentService.studentExamAnalyticsListing(nonAttendedExamFilter).subscribe((response: any) => {
      this.nonAttendedExamsDataSource = response.data;
    });
  }
  getStudeDetails() {
    this._studentService.getStudentDetailsById(this.userId).then((response: any) => {

      this.studentReportCardDetails = response;

    });
  }
  backClicked() {
    this._location.back();
  }
  editStudent(): void {

    this._studentService.getStudentDetailsById(this.userId).then(response => {
      this.dialogRef = this._matDialog.open(CreateStudentComponent, {
        panelClass: 'student-form-dialog',
        data: {
          students: response,
          action: 'edit'
        }

      });
      // Wait for the dialog to close before fetching updated details
      this.dialogRef.afterClosed().subscribe((result: any) => {

        if (result) {
          this.getStudeDetails();  // Refresh the student details after form close
        }
      });
    })

  }



  deleteStudent() {

    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false

    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._studentService.deleteStudent(this.userId);
        this.router.navigate(['/lecture/lecture']); // Navigate after successful deletion
      }
      this.confirmDialogRef = null;
    });
  }
}
