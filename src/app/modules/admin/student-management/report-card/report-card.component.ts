import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexOptions, ApexPlotOptions, ApexXAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { Location } from '@angular/common';
import { studentAnalytics, studentModel, StudentReportCard } from '../student-management.model';
import { StudentService } from '../student-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { studentAnalyticGrid } from '../../common/gridFilter';
import { CreateStudentComponent } from '../create-student/create-student.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SitePreference } from 'app/core/auth/app.configs';
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
  imports: [MatPaginator,MatDatepickerModule,MatTableModule, CommonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatChipsModule, NgApexchartsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.scss'
})
export class ReportCardComponent {
  students: studentModel;
  userId: string;
  studentReportCardDetails: StudentReportCard;
  AttendanceForm: FormGroup;
  examAnalyticsListing: any
  displayedColumns: string[] = ['date', 'examname', 'subject', 'rank', 'avgscore', 'result'];
  displayedColumns1: string[] = ['CheckIn', 'CheckOut', 'departmentName', 'availablity'];
  dataSource: any = [];
  courseYearName: any
  attendedExamsDataSource: any[] = [];
  nonAttendedExamsDataSource: any[] = [];
  attendanceDataSource: any[] = [];
  @ViewChild("linearchart") linearChart: ChartComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public linearChartOptions: ApexOptions = {};
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  _sitePreference: any = SitePreference;


  @ViewChild('dialogContent', { static: true })
  dialogContent: TemplateRef<any>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  dialogRef: any;
  attendencedataSource: AttendanceDataSource;
  StartDate: string ='2025-01-18T13:54:07.309Z';
  EndDate: string ='2025-02-18T13:54:07.309Z';
  constructor(
    private _formbuilder: FormBuilder,
    private _location: Location, 
    public _matDialog: MatDialog, 
    private _studentService: StudentService, 
    private route: ActivatedRoute, 
    private router: Router) {

    this.route.params.subscribe((parram) => {

      this.userId = parram.userId;
      this.courseYearName = parram.courseYear;

    });
    this.AttendanceForm = this._formbuilder.group({
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
    })
  

    // this.linearChartOptions = {


    //   series: [
    //     {
    //       name: "Progress",
    //       data: [
    //         {
    //           x: "Anatomy",
    //           y: 98,
    //           fillColor: "#7EE8CA"

    //         },
    //         {
    //           x: "Chemistry",
    //           y: 84,
    //           fillColor: "#7EE8CA"
    //         }

    //         , {
    //           x: "Pediatrics",
    //           y: 78,
    //           fillColor: "#9BD7FF"
    //         }, {
    //           x: "Dermatolog",
    //           y: 74,
    //           fillColor: "#9BD7FF"
    //         }
    //         , {
    //           x: "Pediatrics",
    //           y: 60,
    //           fillColor: "#FFDA9B"
    //         }, {
    //           x: "Dermatolog",
    //           y: 52,
    //           fillColor: "#FFDA9B"
    //         }
    //         , {
    //           x: "Pediatrics",
    //           y: 41,
    //           fillColor: "#FFDA9B"
    //         }, {
    //           x: "Dermatolog",
    //           y: 32,
    //           fillColor: "#FFB9AD"
    //         }
    //         , {
    //           x: "Pediatrics",
    //           y: 21,
    //           fillColor: "#FFB9AD"
    //         }, {
    //           x: "Dermatolog",
    //           y: 20,
    //           fillColor: "#FFB9AD"
    //         }
    //       ]
    //     }
    //   ],
    //   grid: {

    //     show: false,  // This removes the grid

    //     // row: {
    //     //   colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
    //     //   opacity: 0.5
    //     // },
    //     xaxis: {
    //       lines: {
    //         show: false
    //       }
    //     },
    //     yaxis: {
    //       lines: {
    //         show: false
    //       }
    //     }
    //   },
    //   chart: {
    //     type: "bar",
    //     height: 350,
    //     // width: 1000,
    //     offsetY: -10,
    //     toolbar: {
    //       show: false
    //     },

    //   },

    //   plotOptions: {
    //     bar: {
    //       horizontal: true,

    //       dataLabels: {
    //         position: "top"
    //       },
    //       barHeight: "45%",
    //     }
    //   },
    //   dataLabels: {
    //     enabled: true,
    //     offsetX: 25,
    //     formatter: function (val) {
    //       return val + "%";
    //     },
    //     style: {
    //       fontSize: "10px",
    //       colors: ["#505050"]
    //     }
    //   },
    //   stroke: {
    //     show: true,
    //     width: 0,
    //     colors: ['transparent']  // Change to transparent
    //   },
    //   xaxis: {
    //     axisBorder: {
    //       show: false // Hides the x-axis border
    //     },
    //     axisTicks: {
    //       show: false // Hides the x-axis ticks
    //     },
    //     categories: [
    //       "Anatomy",
    //       "Chemistry",
    //       "Pediatrics",
    //       "Dermatolog",
    //       "Pharmacology",
    //       "ENT",
    //       "Orthopedics",
    //       "Medicine",
    //       "Physicology",
    //       "FM"
    //     ],
    //     labels: {
    //       show: false // Hides the x-axis tick labels (numbers)
    //     }
    //   },
    //   yaxis: {
    //     labels: {
    //       show: true,  // Keep the labels visible
    //       style: {
    //         colors: '#000000'  // You can adjust the color
    //       }
    //     },
    //     axisBorder: {
    //       show: false
    //     },
    //     axisTicks: {
    //       show: false
    //     }
    //   },

    // };
    
  }

  ngOnInit(): void {
    this.StartDate = this.AttendanceForm.get('StartDate').value
    this.EndDate = this.AttendanceForm.get('StartDate').value
    console.log(this.StartDate,this.EndDate,"this.StartDate")
    this.fetchChartData();
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
    this.attendencedataSource = new AttendanceDataSource(this._studentService);
    this._studentService.onStudentListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res=>{
      let gridFilter = {
        keyword: '',
        pageNumber: this.paginator?.pageIndex + 1,
        pageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
        orderBy: '',
        sortOrder: '',
        startDate: "2025-01-18T13:54:07.309Z",
        endDate: "2025-02-18T13:54:07.309Z",
        userId: this.userId
      };
      this.attendencedataSource.getExamList(gridFilter);
    })
  }

  getNext(event: PageEvent) {
    this._studentService.onStudentListChanged.next(true);
  }
  
  // fetchChartData() {
  //   this._studentService.studentSubjectSummary(this.userId).subscribe((response: any) => {
  //     const categories = response.map((item: any) => item.name);
  //     const colors = ["#7EE8CA", "#9BD7FF", "#FFB6C1", "#FFA07A", "#FFD700", "#8A2BE2", "#32CD32"]; // Different colors

  //     const dataSeries = response.map((item: any, index: number) => ({
  //       x: item.name,
  //       y: item.count,
  //       fillColor: colors[index % colors.length] // Assign different colors cyclically
  //     }));

  //     this.linearChartOptions = {
  //       series: [{ name: "Progress", data: dataSeries }],
  //       grid: {
  //         row: {
  //           colors: ["transparent", "transparent"],
  //           opacity: 0.5
  //         },
  //         padding: {
  //           left: 0,
  //           right: 0
  //         }
  //       },
  //       chart: {
  //         type: "bar",
  //         height: 270,
  //         // width: 1000,
  //         offsetY: -10
  //       },
  //       plotOptions: {
  //         bar: {
  //           horizontal: true,
  //           dataLabels: { position: "top" },
  //           barHeight: "10%"
  //         }
  //       },
  //       dataLabels: {
  //         enabled: true,
  //         offsetX: 25,
  //         style: {
  //           fontSize: "12px",
  //           colors: ["#505050"]
  //         }
  //       },
  //       stroke: {
  //         show: true,
  //         width: 1,
  //         colors: ["#fff"]
  //       },
  //       xaxis: {
  //         categories,
  //         labels: { show: false } // Hide x-axis labels (count)
  //       },
  //       yaxis: {
  //         labels: {
  //           style: {
  //             fontSize: "12px",
  //             colors: "#000"
  //           }
  //         }
  //       }
  //     };
  //   });
  // }
  fetchChartData() {
    this._studentService.studentSubjectSummary(this.userId).subscribe((response: any) => {
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

  getDataDateWise(){
    this._studentService.onStudentListChanged.next(true);
  }
  ngOnDestroy(): void {
    
    this._unsubscribeAll.unsubscribe();
    if (this.attendencedataSource) {
      this.attendencedataSource.disconnect();
    }
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
export class AttendanceDataSource extends DataSource<any>
{

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  ExamList: Array<any> = []
  ExamCount: number;

  constructor(private _studentService: StudentService) {
    super();
  }

  disconnect(): void {
  }

  connect(): Observable<any[]> {
    return this._studentService.onStudentListChanged;
  }

  getExamList(gridFilter) {
    var self = this;
    this._studentService.studentAttendance(gridFilter).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    )

      .subscribe((res: any) => {
        this.ExamList = res?.data;
        this.ExamCount = res?.Count;
        self.paginationData = {
          count: res?.totalCount,
          pageNumber: res?.currentPage
        };
      });

  }

}
