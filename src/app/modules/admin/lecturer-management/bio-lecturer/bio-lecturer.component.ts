import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Location } from '@angular/common';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexOptions, ApexPlotOptions, ApexXAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LectureService } from '../lecturer-management.service';
import { lectureModel } from '../lecturer-management.model';
import { lecturerAnalyticGrid } from '../../common/gridFilter';
import { CreateLecturerComponent } from '../create-lecturer/create-lecturer.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
export type linearChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};
interface QBankType {
  title: string;
  id: number;
  domainEvents: any[];
}


@Component({
  selector: 'app-bio-lecturer',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatChipsModule, NgApexchartsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bio-lecturer.component.html',
  styleUrl: './bio-lecturer.component.scss'
})
export class BioLecturerComponent implements OnInit {
  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  userId: string;
  lecturer: any;
  displayQBanks: QBankType[] = [];
  allQBanks: QBankType[] = [];  // Will store all available question banks
  courseYearName: string;
  // lecturer: LecturerList = {
  //   LecturerImage: '',
  //   LecturerName: 'Vansh Garg',
  //   CourseYear: 'First Year',
  //   Bio: '',
  //   EmployeeID: 0,
  //   IsActive: false,
  //   Subjects: [1, 2],
  //   MobileNumber: '224141414',
  //   Email: 'vansh@gmail.com'
  // }
  displayedColumns: string[] = ['date', 'examname', 'subject', 'Year', 'Attendees', 'avgscore', 'Status'];
  dataSource: any = []

  @ViewChild("linearchart") linearChart: ChartComponent;
  public linearChartOptions: ApexOptions = {};
  constructor(private _location: Location, public _matDialog: MatDialog, private route: ActivatedRoute, private _lectureService: LectureService, private router: Router) {
    this.route.params.subscribe((parram) => {

      this.userId = parram.userId;
      this.courseYearName = parram.courseYear;

    });

    // this.linearChartOptions = {


    //   series: [
    //     {
    //       name: "Progress",
    //       data: [
    //         {
    //           x: "Anatomy",
    //           y: 185,
    //           fillColor: "#7EE8CA"

    //         },
    //         {
    //           x: "Bio-Chemistry",
    //           y: 128,
    //           fillColor: "#7EE8CA"
    //         }

    //         , {
    //           x: "Pediatrics",
    //           y: 91,
    //           fillColor: "#9BD7FF"
    //         }, {
    //           x: "Dermatolog",
    //           y: 22,
    //           fillColor: "#9BD7FF"
    //         }
    //       ]
    //     }
    //   ],
    //   grid: {
    //     row: {
    //       colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
    //       opacity: 0.5,

    //     },
    //     // Hide the background lines
    //     padding: {
    //       left: 0,
    //       right: 0
    //     }
    //   },
    //   chart: {
    //     type: "bar",
    //     height: 270,
    //     width: 1000,
    //     offsetY: -10
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: true,
    //       dataLabels: {
    //         position: "top",

    //       },
    //       barHeight: "20%"
    //     }
    //   },
    //   dataLabels: {
    //     enabled: true,
    //     offsetX: 25,
    //     style: {
    //       fontSize: "12px",
    //       colors: ["#505050"]
    //     }

    //   },
    //   stroke: {
    //     show: true,
    //     width: 1,
    //     colors: ["#fff"]
    //   },
    //   xaxis: {
    //     categories: [
    //       "Anatomy",
    //       "Bio-Chemistry",
    //       "Pediatrics",
    //       "Dermatolog",
    //     ]
    //   },


    // };

  }

  ngOnInit(): void {
    this.getLecturerById();
    const ExamFilter: lecturerAnalyticGrid = {
      keyword: '',
      pageNumber: 1,
      pageSize: 10,
      orderBy: '',
      sortOrder: 'desc',

      userId: this.userId
    };

    this._lectureService.lecturerAnalyticsListing(ExamFilter).subscribe((res) => {
      this.dataSource = res.data;
    })
    this.fetchChartData();
  }

  fetchChartData() {
    this._lectureService.lecturereQbankSummary(this.userId).subscribe((response: any) => {
      const categories = response.map((item: any) => item.name);
      const colors = ["#7EE8CA", "#9BD7FF", "#FFB6C1", "#FFA07A", "#FFD700", "#8A2BE2", "#32CD32"]; // Different colors

      const dataSeries = response.map((item: any, index: number) => ({
        x: item.name,
        y: item.count,
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



  getLecturerById() {
    this._lectureService.getLectureDetailsById(this.userId).then((res) => {

      this.lecturer = res;

    })
  }
  backClicked() {
    this._location.back();
  }
  editLecturer(): void {

    this._lectureService.getLectureDetailsById(this.userId).then(response => {
      this.dialogRef = this._matDialog.open(CreateLecturerComponent, {
        panelClass: 'lecture-form-dialog',
        data: {
          lecturer: response,
          action: 'edit'
        }

      });
      // Wait for the dialog to close before fetching updated details
      this.dialogRef.afterClosed().subscribe((result: any) => {

        if (result) {
          this.getLecturerById();  // Refresh the student details after form close
        }
      });
    })

  }

  deleteLecture() {

    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false

    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._lectureService.deleteLecture(this.userId);
        this.router.navigate(['/lecture/lecture']); // Navigate after successful deletion
      }
      this.confirmDialogRef = null;
    });
  }
}

