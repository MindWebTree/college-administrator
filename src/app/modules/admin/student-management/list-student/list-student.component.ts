import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, filter, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { StudentService } from '../student-management.service';
import { studentModel } from '../student-management.model';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SitePreference } from 'app/core/auth/app.configs';
import { studentGrid } from '../../common/gridFilter';
import { CreateStudentComponent } from '../create-student/create-student.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list-student',
  standalone: true,
  imports: [MatPaginatorModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule, MatButtonModule, OverlayModule, FormsModule],
  templateUrl: './list-student.component.html',
  styleUrl: './list-student.component.scss'
})
export class ListStudentComponent {

  studentManagement: any;


  @ViewChild('dialogContent', { static: true })
  dialogContent: TemplateRef<any>;
  _sitePreference: any = SitePreference;
  searchInput: FormControl;
  paginationData: any;
  // students: StudentList;
  dataSource: StudentManagementDataSource;
  selectedQuestionSet: any[];
  checkboxes: {};
  dialogRef: any;
  average: any = 0;
  averageBy: any = 0;
  currentSearchText: string = ''; // added by harsh to track current search
  averageType: string = "";
  courseyearId: string = ""
  CourseYear: string = ""
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public _matDialog: MatDialog,
    public _route: ActivatedRoute,
    private _studentService: StudentService, private _router: Router
  ) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      this.courseyearId = this._route.snapshot.params['guid'];
      this.loadStudentData();
    });
    this._route.params.subscribe(res => {
      this.courseyearId = res.guid;
      this.loadStudentData();
    })

    this.searchInput = new FormControl('');

  }
  private loadStudentData(): void {
    // Trigger data reload
    this._studentService.onStudentManagementChanged.next(true);
    this._studentService.getCourseYearName(this.courseyearId).subscribe((res: any) => {
      this.CourseYear = res.name
    })
  }

  deleteStudent(user) {

    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false

    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._studentService.deleteStudent(user.id);

      }
      this.confirmDialogRef = null;
    });
  }
  loadPage() {
    this._studentService.onStudentManagementChanged.next(this.studentManagement);
  }


  getNext(event: PageEvent) {
    this._studentService.onStudentManagementChanged.next(this.studentManagement);

  }

  onSortData(sort: Sort) {

    this._studentService.onStudentManagementChanged.next(this.studentManagement);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  ngOnInit(): void {
    this.dataSource = new StudentManagementDataSource(this._studentService);

    this._studentService.onStudentManagementChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {
        this.studentManagement = search;
        let gridFilter: studentGrid = {
          pageNumber: this.paginator.pageIndex + 1,
          pageSize: this.paginator.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
          keyword: typeof search === "string" ? search : this.currentSearchText,
          orderBy: this.sort?.active == null ? "QueueId" : "QueueId",
          sortOrder: this.sort?.direction == 'desc' ? this.sort.direction : 'asc',
          averageType: this.averageType, // '>' or '<'
          average: this.averageBy,
          courseYearId: this.courseyearId
        };
        this.dataSource.loadData(gridFilter);
      });
    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this.currentSearchText = searchText;
        this._studentService.onStudentManagementChanged.next(searchText);
      });
  }

  onAverageChange(event: any) {
    const selectedValue = event.value;

    // Extract operator ('>' or '<') and numeric value
    const match = selectedValue.match(/([><])(\d+)/);
    if (match) {
      this.averageType = match[1];  // '>' or '<'
      this.averageBy = parseInt(match[2], 10);  // 33, 66, 99
    } else {
      this.averageType = "";
      this.averageBy = 0;
    }

    // Trigger filtering
    this._studentService.onStudentManagementChanged.next(this.currentSearchText);
  }
  addStudent() {

    var students = new studentModel({});
    this.dialogRef = this._matDialog.open(CreateStudentComponent, {
      panelClass: 'student-form-dialog',
      disableClose: true,
      data: {
        action: 'new',
        students: students,
      }
    });
  }

  editStudent(user: any): void {

    this._studentService.getStudentDetailsById(user.id).then(response => {
      this.dialogRef = this._matDialog.open(CreateStudentComponent, {
        panelClass: 'student-form-dialog',
        data: {
          students: response,
          action: 'edit'
        }

      });
      // this.editStudentCallback(this.students)
    })

  }
  onNavigate(user: any) {

    this._router.navigate(['/student/student-report-card/' + user.id + '/' + this.CourseYear]);
  }
  bulkUploadStudent(){}


}

export class StudentManagementDataSource extends DataSource<studentModel> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  data: Array<studentModel> = []
  /**
   * Constructor
   *
   * @param {StudentService} _studentService
   */
  constructor(
    private _studentService: StudentService
  ) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._studentService.onStudentManagementChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }

  loadData(gridFilter: studentGrid): void {
    this.loadingSubject.next(true);
    this._studentService.getStudentForGrid(gridFilter)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        this.data = response.data;

        this.paginationData = {
          count: response.totalCount || 0,
          pageNumber: response.currentPage || 1,
          pageSize: response.pageSize || 10
        };
      });
  }
}
