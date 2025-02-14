import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { ExamService } from '../exam.service';
import { ExamList, ExamStatus } from '../exam.model';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SitePreference } from 'app/core/auth/app.configs';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../pipes/duration.pipe';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ExamReportComponent } from '../exam-report/exam-report.component';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [MatDatepickerModule, MatDialogModule,
    MatNativeDateModule, MatIconModule, ReactiveFormsModule, MatInputModule, MatStepperModule, CommonModule, MatPaginatorModule, DurationPipe, MatFormFieldModule],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss'
})
export class ExamListComponent implements OnInit {
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  @ViewChild('examExit') examExit!: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) completedpaginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) cancelledpaginator: MatPaginator;
  dataSource: UpcomingExamslistDataSource;
  completeddataSource: CompletedExamslistDataSource;
  cancelleddataSource: CancelledExamslistDataSource;
  status: number;
  _sitePreference: any = SitePreference;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  courseYearId: string = "";
  ExamReSchedule: FormGroup
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  durationMinuts: any;
  minDate: Date = new Date();
  IsSheduleFormHasError: boolean = false;
  invalidStartTime: boolean = false;
  invalidEndTime: boolean = false;
  submitted: boolean = false;
  rescheduleExamId: number = 0;
  mintime: number = 0;
  CourseYearName: string = '';
  endDateLabel: boolean = true;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _formbuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _examService: ExamService
  ) {
    this.ExamReSchedule = this._formbuilder.group({
      ExamDate: ['', Validators.required],
      StartTime: ['', Validators.required],
      EndTime: ['', []],
    });
    this.ExamReSchedule = new FormGroup({
      ExamDate: new FormControl('', Validators.required),
      StartTime: new FormControl('', Validators.required),
      EndTime: new FormControl('', [Validators.required]),
    });

    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      this.courseYearId = this._route.snapshot.params['guid'];
      this.loadExamData();
    });
    this._route.params.subscribe(res => {
      this.courseYearId = res.guid
    })

    this._examService.getCourseYearName(this.courseYearId).subscribe((res: any) => {
      this.CourseYearName = res.name
    })
  }
  private loadExamData(): void {
    this._examService.getCourseYearName(this.courseYearId).subscribe((res: any) => {
      this.CourseYearName = res.name
    })
    // Trigger data reload
    this._examService.onUpcomingExamListChanged.next(true);
    this._examService.onCompletedExamListChanged.next(true);
    this._examService.onCancelledExamListChanged.next(true);
  }

  // loadPage() {
  //   this._examService.onUpcomingExamListChanged.next(true);
  //   this._examService.onCancelledExamListChanged.next(true);
  //   this._examService.onCompletedExamListChanged.next(true);
  // }
  getNext(event: PageEvent) {
    let gridFilter: ExamList = {
      keyword: '',
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize,  // Use the event's pageSize
      orderBy: '',
      sortOrder: '',
      examStatus: ExamStatus.New,
      courseYearId: this.courseYearId
    };
    this.dataSource.getExamList(gridFilter, this.status);

  }
  getNext1(event: PageEvent) {
    let gridFilter: ExamList = {
      keyword: '',
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize,  // Use the event's pageSize
      orderBy: '',
      sortOrder: '',
      examStatus: ExamStatus.Completed,
      courseYearId: this.courseYearId
    };
    this.completeddataSource.getExamList(gridFilter, this.status);

  }
  getNext2(event: PageEvent) {
    let gridFilter: ExamList = {
      keyword: '',
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize,  // Use the event's pageSize
      orderBy: '',
      sortOrder: '',
      examStatus: ExamStatus.Cancelled,
      courseYearId: this.courseYearId
    };
    this.cancelleddataSource.getExamList(gridFilter, this.status);

  }
  openDialogWithTemplateRef(templateRef: any, panelClass: any, examdetail: any): MatDialogRef<any> {
    this.closedialog(); // Close any previous dialogs
    let dialogRef: MatDialogRef<any>;

    dialogRef = this.dialog.open(templateRef, {
      panelClass: panelClass,
      disableClose: true,
      data: examdetail
    });


    return dialogRef;
  }
  closedialog() {// close all popup 
    this.submitted = false;
    this.invalidStartTime = false;
    this.invalidEndTime = false;
    this.dialog.closeAll();
    if (this.ExamReSchedule) {
      this.ExamReSchedule.reset();
      Object.keys(this.ExamReSchedule.controls).forEach(key => {
        this.ExamReSchedule.get(key)?.clearValidators();
        this.ExamReSchedule.get(key)?.updateValueAndValidity();
      });
    }
  }

  ngOnInit(): void {
    this.mintime = parseInt(this.minDate.toTimeString().split(' ')[0]);
    let date = this.minDate.toISOString().split('T')
    this.ExamReSchedule.patchValue({
      ExamDate: date[0]
    });
    this.dataSource = new UpcomingExamslistDataSource(this._examService)
    this.completeddataSource = new CompletedExamslistDataSource(this._examService)
    this.cancelleddataSource = new CancelledExamslistDataSource(this._examService)
    this._examService.onUpcomingExamListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      let gridFilter: ExamList = {
        keyword: '',
        pageNumber: this.paginator?.pageIndex + 1,
        pageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
        orderBy: '',
        sortOrder: '',
        examStatus: ExamStatus.New,
        courseYearId: this.courseYearId
      };
      this.dataSource.getExamList(gridFilter, this.status);
    })
    this._examService.onCompletedExamListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      let gridFilter: ExamList = {
        keyword: '',
        pageNumber: this.completedpaginator?.pageIndex + 1,
        pageSize: this.completedpaginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.completedpaginator.pageSize,
        orderBy: '',
        sortOrder: '',
        examStatus: ExamStatus.Completed,
        courseYearId: this.courseYearId
      };
      this.completeddataSource.getExamList(gridFilter, this.status);
    })
    this._examService.onCancelledExamListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      let gridFilter: ExamList = {
        keyword: '',
        pageNumber: this.cancelledpaginator?.pageIndex + 1,
        pageSize: this.cancelledpaginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.cancelledpaginator.pageSize,
        orderBy: '',
        sortOrder: '',
        examStatus: ExamStatus.Cancelled,
        courseYearId: this.courseYearId
      };
      this.cancelleddataSource.getExamList(gridFilter, this.status);
    })
  }
  editExam(id) {
    console.log(id, "editExam")
    this._router.navigate([`/exam/edit/${id}`]);
  }
  deleteExam(id) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      panelClass: 'delete-choice',

    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._examService.deleteExam(id).subscribe(res => {
          this._examService.onUpcomingExamListChanged.next(true);
          this._examService.onCancelledExamListChanged.next(true);
          this._examService.onCompletedExamListChanged.next(true);

        });
      }
      this.confirmDialogRef = null;
    });
  }
  cancelExam(id) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      panelClass: 'cancel-choice',

    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Cancel Exam?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._examService.cancelExam(id).subscribe(res => {
          this._examService.onUpcomingExamListChanged.next(true)
          this._examService.onCompletedExamListChanged.next(true)
          this._examService.onCancelledExamListChanged.next(true)
        });
      }
      this.confirmDialogRef = null;
    });
  }
  reschedule(exam) {
    if (exam.examMode == 0) {
      this.endDateLabel = false;
      this.ExamReSchedule.get('EndTime')?.clearValidators(); // Remove required validation
      this.ExamReSchedule.get('EndTime')?.updateValueAndValidity();
    } else {
      this.endDateLabel = true;
      this.ExamReSchedule.get('EndTime')?.setValidators([Validators.required]); // Add required validation
      this.ExamReSchedule.get('EndTime')?.updateValueAndValidity();
    }
    this.openDialogWithTemplateRef(this.examExit, "data", exam);
    this.mintime = parseInt(this.minDate.toTimeString().split(' ')[0]);
    let date = this.minDate.toISOString().split('T')
    // to bind the valye when popup open
    let examDateTime = new Date(exam.examDate);
    let examEndDateTime = new Date(exam.examEndDate);

    let examDate = examDateTime.toISOString().split('T')[0]; // Extract date part
    let startTime = examDateTime.toTimeString().split(' ')[0].substring(0, 5); // Extract HH:mm format
    let endTime = examEndDateTime.toTimeString().split(' ')[0].substring(0, 5); // Extract HH:mm format
    this.ExamReSchedule.patchValue({
      ExamDate: examDate,
      StartTime: startTime,
      EndTime: exam.examMode == 0 ? '' : endTime, // Clear EndTime if examMode is 0
    });
    this.rescheduleExamId = exam.id
  }
  rescheduleSubmit() {
    this.submitted = true;

    this.calculateDuration();
    if (this.ExamReSchedule.valid) {
      const formData = this.ExamReSchedule.value;
      // Get the date from ExamDate
      const examDate = new Date(formData.ExamDate);

      // Create the start date-time by combining date and start time
      const [startHours, startMinutes] = formData.StartTime.split(':');
      const examStartDate = new Date(examDate);
      examStartDate.setHours(parseInt(startHours), parseInt(startMinutes), 0);

      // Create the end date-time by combining date and end time
      // const [endHours, endMinutes] = formData.EndTime.split(':');
      // const examEndDate = new Date(examDate);
      // examEndDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);

      const req: any = {
        id: this.rescheduleExamId,
        examDate: this.convertToLocalTime(examStartDate).toISOString(), // This will format as "2025-01-30T15:00:00.000Z"
        // examEndDate: this.convertToLocalTime(examEndDate).toISOString() // This will format as "2025-01-30T16:00:00.000Z"
      };
      // Only include EndTime if examMode !== 0
      if (this.endDateLabel) {
        const [endHours, endMinutes] = formData.EndTime.split(':');
        const examEndDate = new Date(examDate);
        examEndDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);
        req.examEndDate = this.convertToLocalTime(examEndDate).toISOString();
      }
      if (!this.invalidStartTime || !this.invalidEndTime) {
        this._examService.rescheduleExam(req).subscribe(res => {
          this.closedialog();
          this._examService.onCancelledExamListChanged.next(true);
          this._examService.onUpcomingExamListChanged.next(true);
        });
      }

    } else {
      Object.keys(this.ExamReSchedule.controls).forEach(key => {
        const control = this.ExamReSchedule.get(key);
        control?.markAsTouched();
      });
    }
  }
  gettimeleft(examdate: string): string {
    const examDateTime = new Date(examdate); // Convert exam date string to Date object
    const nowTime = this.minDate; // Current time

    const timeDiff = examDateTime.getTime() - nowTime.getTime(); // Difference in milliseconds
    console.log(timeDiff, "timeDiff")
    if (timeDiff <= 0) {
      return "Exam has already started"; // If the exam time has passed
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60)); // Convert to hours
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining to minutes

    return `Starts on ${hours} hrs ${minutes} min`;
  }
  private convertToLocalTime(date: Date): Date {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - (offset * 60 * 1000));
  }

  validateTimes(group: FormGroup) {
    const startTime = group.get('StartTime')?.value;
    const endTime = group.get('EndTime')?.value;

    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);

      if (end <= start) {
        group.get('EndTime')?.setErrors({ invalidEndTime: true });
        return { invalidEndTime: true };
      }
    }
    return null;
  }
  calculateDuration() {
    const examDate = new Date(this.ExamReSchedule.get('ExamDate')?.value);
    const startTime = this.ExamReSchedule.get('StartTime')?.value;
    const endTime = this.ExamReSchedule.get('EndTime')?.value;

    if (startTime && endTime && examDate) {
      // Create Date objects for start and end times on the selected date
      const [startHours, startMinutes] = startTime.split(':');
      const examStartDateTime = new Date(examDate);
      examStartDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

      const [endHours, endMinutes] = endTime.split(':');
      const examEndDateTime = new Date(examDate);
      examEndDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

      // Get current date and time
      const currentDateTime = new Date();

      // Compare with current time
      this.invalidStartTime = examStartDateTime <= currentDateTime;
      this.invalidEndTime = examEndDateTime <= currentDateTime;

      // Also validate that end time is after start time
      if (examEndDateTime <= examStartDateTime) {
        this.ExamReSchedule.get('EndTime')?.setErrors({ 'endBeforeStart': true });
      } else {
        // Clear the error if it was previously set
        const currentErrors = this.ExamReSchedule.get('EndTime')?.errors;
        if (currentErrors) {
          delete currentErrors['endBeforeStart'];
          this.ExamReSchedule.get('EndTime')?.setErrors(
            Object.keys(currentErrors).length === 0 ? null : currentErrors
          );
        }
      }

      // Set form errors based on validations
      if (this.invalidStartTime) {
        this.ExamReSchedule.get('StartTime')?.setErrors({ 'pastTime': true });
      }
      if (this.invalidEndTime) {
        this.ExamReSchedule.get('EndTime')?.setErrors({ 'pastTime': true });
      }

    }
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  openReportCard(exam) {
    let dialogRef: MatDialogRef<any>;
    dialogRef = this.dialog.open(ExamReportComponent, {
      data: exam,
    });
  }
  ngOnDestroy(): void {
    if (this.ExamReSchedule) {
      this.ExamReSchedule.reset();
      Object.keys(this.ExamReSchedule.controls).forEach(key => {
        this.ExamReSchedule.get(key)?.clearValidators();
        this.ExamReSchedule.get(key)?.updateValueAndValidity();
      });
    }
    // This triggers all takeUntil operators to complete their subscriptions
    this._unsubscribeAll.unsubscribe();
    // this._unsubscribeAll.complete();
    // Cleanup dialogs
    if (this.confirmDialogRef) {
      this.confirmDialogRef.close();
    }

    // Cleanup data sources
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    if (this.completeddataSource) {
      this.completeddataSource.disconnect();
    }
    if (this.cancelleddataSource) {
      this.cancelleddataSource.disconnect();
    }
  }
}

export class UpcomingExamslistDataSource extends DataSource<any> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  ExamList: Array<any> = []
  ExamCount: number;

  constructor(private _examService: ExamService) {
    super();
  }

  disconnect(): void {
  }

  connect(): Observable<any[]> {
    return this._examService.onExamListChanged;
  }

  getExamList(gridFilter: ExamList, status) {
    var self = this;
    this._examService.getExamList(gridFilter).pipe(
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
export class CompletedExamslistDataSource extends DataSource<any> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  ExamList: Array<any> = []
  ExamCount: number;

  constructor(private _examService: ExamService) {
    super();
  }

  disconnect(): void {
  }

  connect(): Observable<any[]> {
    return this._examService.onExamListChanged;
  }

  getExamList(gridFilter: ExamList, status) {
    var self = this;
    this._examService.getExamList(gridFilter).pipe(
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
export class CancelledExamslistDataSource extends DataSource<any> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  ExamList: Array<any> = []
  ExamCount: number;

  constructor(private _examService: ExamService) {
    super();
  }

  disconnect(): void {
  }

  connect(): Observable<any[]> {
    return this._examService.onExamListChanged;
  }

  getExamList(gridFilter: ExamList, status) {
    var self = this;
    this._examService.getExamList(gridFilter).pipe(
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