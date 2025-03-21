import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, filter, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { LectureService } from '../lecturer-management.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { lectureModel } from '../lecturer-management.model';
import { SitePreference } from 'app/core/auth/app.configs';
import { CreateLecturerComponent } from '../create-lecturer/create-lecturer.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { GridFilter, lecturerGrid } from '../../common/gridFilter';

@Component({
  selector: 'app-list-lecturer',
  standalone: true,
  imports: [MatPaginatorModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule, MatButtonModule, OverlayModule, FormsModule],
  templateUrl: './list-lecturer.component.html',
  styleUrl: './list-lecturer.component.scss'
})
export class ListLecturerComponent {

  lectureManagement: any;
  @ViewChild('dialogContent', { static: true })
  dialogContent: TemplateRef<any>;
  _sitePreference: any = SitePreference;
  searchInput: FormControl;
  Subject: FormControl;
  paginationData: any;

  dataSource: LectureManagementDataSource;


  dialogRef: any;
  subjects: any;

  currentSearchText: string = ''; // added by harsh to track current search
  courseyearId: string = '';
  CourseYear: string = '';

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public _matDialog: MatDialog,
    public _route: ActivatedRoute,
    public _formBuilder: FormBuilder,
    private _lectureService: LectureService, private _router: Router) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      this.courseyearId = this._route.snapshot.params['guid'];
      this.loadStudentData();
    });
    this._route.params.subscribe(res => {
      this.courseyearId = res.guid;
      this.loadStudentData()
    })
    this.searchInput = new FormControl('');
    this.Subject = new FormControl('0');
    
    
  }

  loadStudentData() {
    this._lectureService.onlectureManagementChanged.next(true)
    this._lectureService.getCourseYearName(this.courseyearId).subscribe((res: any) => {
      this.CourseYear = res.name
    })
  }
  Search(){
    this._lectureService.onlectureManagementChanged.next(true)
  }


  deleteLecture(user) {

    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false

    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._lectureService.deleteLecture(user.id);

      }
      this.confirmDialogRef = null;
    });
  }
  loadPage() {
    this._lectureService.onlectureManagementChanged.next(this.lectureManagement);
  }


  getNext(event: PageEvent) {
    this._lectureService.onlectureManagementChanged.next(this.lectureManagement);

  }


  onSortData(sort: Sort) {

    this._lectureService.onlectureManagementChanged.next(this.lectureManagement);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  ngOnInit(): void {
    this._lectureService.getSubjects().subscribe(res=>{
      this.subjects =res;
    })
    this.dataSource = new LectureManagementDataSource(this._lectureService);

    this._lectureService.onlectureManagementChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {
        this.lectureManagement = search;
        let gridFilter: lecturerGrid = {
          pageNumber: this.paginator.pageIndex + 1,
          pageSize: this.paginator.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
          keyword: typeof search === "string" ? search : this.currentSearchText,
          orderBy: this.sort?.active == null ? "QueueId" : "QueueId",
          sortOrder: this.sort?.direction == 'desc' ? this.sort.direction : 'asc',
          courseYearId: this.courseyearId,
          subjectId: this.Subject?.value ? parseInt(this.Subject?.value) : 0 
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
        this._lectureService.onlectureManagementChanged.next(searchText);
      });
  }


  addLecture() {

    var lecturer = new lectureModel({});
    this.dialogRef = this._matDialog.open(CreateLecturerComponent, {
      panelClass: 'lecture-form-dialog',
      disableClose: true,
      data: {
        action: 'new',
        lecturer: lecturer,
      }
    });
  }

  editLecturer(leacturer: any): void {

    this._lectureService.getLectureDetailsById(leacturer.id).then(response => {
      this.dialogRef = this._matDialog.open(CreateLecturerComponent, {
        panelClass: 'lecture-form-dialog',
        data: {
          lecturer: response,
          action: 'edit'
        }

      });

    })

  }
  onNavigate(user: any) {

    this._router.navigate(['/lecturer/lecturer-bio/' + user.id + '/' + this.CourseYear]);
  }


}

export class LectureManagementDataSource extends DataSource<lectureModel> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  data: Array<lectureModel> = []
  /**
   * Constructor
   *
   * @param {LectureService} _lectureService
   */
  constructor(
    private _lectureService: LectureService
  ) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._lectureService.onlectureManagementChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }

  loadData(gridFilter: GridFilter): void {
    this.loadingSubject.next(true);
    this._lectureService.getlectureForGrid(gridFilter)
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
