import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, filter, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SitePreference } from 'app/core/auth/app.configs';
import { MatIconModule } from '@angular/material/icon';
import { StudentService } from '../../student-management/student-management.service';
import { CreateStudentComponent } from '../../student-management/create-student/create-student.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { studentModel } from '../../student-management/student-management.model';
import { DomSanitizer } from '@angular/platform-browser';
import { XlsxToJsonService } from '../../common/xlsToJSON';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { StudentsService } from '../student.service';
import { LecturerStudentGrid } from '../student.model';

@Component({
  selector: 'app-lecturer-student-list',
  standalone: true,
  imports: [CommonModule, MatPaginator, MatButtonModule, MatSelectModule,  MatTabsModule, MatTableModule, MatIconModule, MatCheckboxModule, ReactiveFormsModule, FormsModule],
  providers: [StudentService, XlsxToJsonService],
  templateUrl: './lecturer-student-list.component.html',
  styleUrl: './lecturer-student-list.component.scss'
})
export class LecturerStudentListComponent  implements OnInit {
  years: any;
  batchId: string;
  selectedYear: any = null; // Initialize as null
  displayedColumns: string[] = ['Name', 'RollNo', 'Select','UpdatedAt'];
  dataSource: FirstYearStudentDataSource;
  selected = new FormControl(0);
  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  _sitePreference: any = SitePreference;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selectedFile: File | null = null;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @Input() files: File[] = [];
  @Input() multiple;
  users: any[];
  accept: string = '.xlsx, .xls';
  isExcekinRigthformrt: boolean = false;
  parsedData: any[] = [];
  inputFileName: string;
  currentPageSize: number = SitePreference.PAGE.GridRowViewCount;
  currentPageIndex: number = 0;
  teams:any;
  groupteams:any;
  parentteams:any;
  filteredteams:any;
  Team: FormControl;  
  ParentTeam: FormControl;  
  GroupTeam: FormControl;  
  @ViewChild('assignTeam') assignTeam!: ElementRef;
  @ViewChild('promoteToNextYear') promoteToNextYear!: ElementRef;

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  selectedStudentIds: any[];
  selectedPromoteStudentIds: any[];
  constructor(
    public _matDialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private _studentService: StudentService,
    private _studentsService: StudentsService,
  ) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      // Reset state when navigating to this component
      this.resetComponentState();
      this.batchId = this._route.snapshot.params['guid'];
      this.loadStudentData();
    });
    
    this._route.params.subscribe(res => {
      // If batchId changes, reset state
      if (this.batchId !== res.guid) {
        this.resetComponentState();
        this.batchId = res.guid;
        this.loadStudentData();
      }
    });
  }
  
  // New method to reset component state
  resetComponentState() {
    this.selectedYear = null;
    this.selected.setValue(0);
    this.files = [];
    this.parsedData = [];
    this.currentPageIndex = 0;
    this.currentPageSize = SitePreference.PAGE.GridRowViewCount;
    
    // Reset paginator if it exists
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = this.currentPageSize;
    }
    
    if (this.fileUpload && this.fileUpload.nativeElement) {
      this.fileUpload.nativeElement.value = '';
    }
  }
  
  // New method to load batch data
  loadBatchData() {
    // Load years first
    this._studentsService.getYears(this.batchId).subscribe(res => {
      this.years = res;
      
      // After getting years, select the first year by default
      if (this.years && this.years.length > 0) {
        this.selectedYear = this.years[0]?.id;
        
        // Then load student data for the selected year
        console.log("1");
        this.loadStudentData();
      }
    });
  }
  
  // New method to load student data
  loadStudentData() {
    
    let gridFilter: LecturerStudentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      batchId: this.batchId,
      teamId: this.GroupTeam?.value ? parseInt(this.GroupTeam?.value) : 0
    };
    
    this.dataSource.loadData(gridFilter);
  }
  SubjectSelected(){
    let gridFilter: LecturerStudentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      batchId: this.batchId,
      teamId: this.GroupTeam?.value ? parseInt(this.GroupTeam?.value) : 0
    };
    
    this.dataSource.loadData(gridFilter);
  }
  
  getNext(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    
    let gridFilter: LecturerStudentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      batchId: this.batchId,
      teamId: this.GroupTeam?.value ? parseInt(this.GroupTeam?.value) : 0
    };
    this.dataSource.loadData(gridFilter);
  }
  OpenDialog(templateRef: any): MatDialogRef<any> {
    return this.dialog.open(templateRef, {
      panelClass: 'assign-tema',
      // disableClose: true
    });
  }
  
 
  ngOnInit(): void {
    this.dataSource = new FirstYearStudentDataSource(this._studentsService);
    
    // Make sure the paginator is initialized with default values
    if (this.paginator) {
      this.paginator.pageIndex = this.currentPageIndex;
      this.paginator.pageSize = this.currentPageSize;
    }
    
    // Initial load handled by constructor and loadBatchData method
    
    this._studentsService.onStudentLecturerGridChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {
        // Reset pagination to first page when data is refreshed
        this.currentPageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        
        console.log("3");
        this.loadStudentData();
      });
  }
  
  ngAfterViewInit() {
    // Make sure the paginator is properly initialized after view init
    if (this.paginator) {
      this.paginator.pageIndex = this.currentPageIndex;
      this.paginator.pageSize = this.currentPageSize;
    }
  }
  
  ngOnDestroy() {
    this._unsubscribeAll?.next();
    this._unsubscribeAll?.complete();
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  isAllPromoteSelected() {
    if (!this.dataSource?.data) return false;
    return this.dataSource.data.length > 0 && this.dataSource.data.every(row => row.promoteSelected);
  }
  
  isSomePromoteSelected() {
    if (!this.dataSource?.data) return false;
    return this.dataSource.data.some(row => row.promoteSelected) && !this.isAllPromoteSelected();
  }
  
  toggleAllPromoteSelection(event: any) {
    if (!this.dataSource?.data) return;
    const checked = event.checked;
    this.dataSource.data.forEach(row => {
      row.promoteSelected = checked;
    });
  }
  
  togglePromoteSelection(row: any, event: any) {
    row.promoteSelected = event.checked;
  }
  
  getPromotedCount(): number {
    if (!this.dataSource?.data) {
      return 0;
    }
    return this.dataSource.data.filter(item => item.promoteSelected).length;
  }
  
  // yearSelected(event: any) {

  //   if (this.years && this.years.length > 0) {
  //     this.selectedYear = this.years[event]?.id;
      
  //     // Reset pagination when changing year
  //     this.currentPageIndex = 0;
  //     if (this.paginator) {
  //       this.paginator.pageIndex = 0;
  //     }
  //   this._studentsService.getTeams().subscribe(res=>{
  //     this.teams = res;      
  //     this.parentteams = this.teams.filter(t=>t.parentTeamId ==0);
  //     this.ParentTeam = new FormControl(this.parentteams[0].id);
  //     this.GetTeams(this.parentteams[0].id);
  //   })
      
  //   console.log("2");
  //     this.loadStudentData();
  //   }
  // }
  ParentGetTeams(teamId){
    this.parentteams = this.teams.filter(t => t.parentTeamId == teamId);
    this.ParentTeam = new FormControl(this.parentteams[0].id);
    this.GetTeams(this.parentteams[0].id);
    let gridFilter: LecturerStudentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      batchId: this.batchId,
      teamId: this.GroupTeam?.value ? parseInt(this.GroupTeam?.value) : 0
    };
    this.dataSource.loadData(gridFilter);
  }
  GetTeams(teamId){
    this.filteredteams = this.teams.filter(t => t.parentTeamId == teamId);
    this.Team = new FormControl(this.filteredteams[0].id);
  }
  
  deleteStudent(user) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._studentService.deleteStudent(user.id);
        this._studentsService.onStudentLecturerGridChanged.next(true);
      }
      this.confirmDialogRef = null;
    });
  }
  
  editStudent(user: any) {
    this._studentService.getStudentDetailsById(user.id).then(response => {
      this.dialogRef = this._matDialog.open(CreateStudentComponent, {
        panelClass: 'student-form-dialog',
        data: {
          students: response,
          action: 'edit'
        }
      });
      this.dialogRef.afterClosed().subscribe(r => {
        this._studentsService.onStudentLecturerGridChanged.next(true);
      })
    })
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
    this.dialogRef.afterClosed().subscribe(r => {
      this._studentsService.onStudentLecturerGridChanged.next(true);
    })
  }

  isAllSelected() {
    if (!this.dataSource?.data) return false;
    const selectableStudents = this.dataSource.data.filter(row => !row.teamDetails?.length);
    return selectableStudents.length > 0 && selectableStudents.every(row => row.selected);
  }

  isSomeSelected() {
    if (!this.dataSource?.data) return false;
    const selectableStudents = this.dataSource.data.filter(row => !row.teamDetails?.length);
    return selectableStudents.some(row => row.selected) && !this.isAllSelected();
  }

  toggleAllSelection(event: any) {
    if (!this.dataSource?.data) return;
    const checked = event.checked;
    this.dataSource.data.forEach(row => {
      if (!row.teamDetails?.length) {
        row.selected = checked;
      }
    });
  }

  toggleSelection(row: any, event: any) {
    if (!row.teamDetails?.length) {
      row.selected = event.checked;
    }
  }

  getSelectedRows() {
    if (!this.dataSource?.data) return;
    const selectedRows = this.dataSource.data.filter(row => row.selected);
    this.selectedStudentIds = selectedRows.map(row => row.id);
    if(this.selectedStudentIds?.length > 0){
      this.OpenDialog(this.assignTeam);
    }else{
      this._studentsService.openSnackBar('Select minimum one Student to Assign Group','close')
    }
  }
  PromoteToNextYear(){
    if (!this.dataSource?.data) return;
    const selectedRows = this.dataSource.data.filter(row => row.promoteSelected);
    this.selectedPromoteStudentIds = selectedRows.map(row => row.id);
    console.log(this.selectedPromoteStudentIds,"studentId");
    if(this.selectedPromoteStudentIds?.length > 0){
      this.OpenDialog(this.promoteToNextYear);
    }else{
      this._studentsService.openSnackBar('Select minimum one Student to Promote','close')
    }
  }
  getSelectedCount(): number {
    if (!this.dataSource?.data) {
      return 0;
    }
    return this.dataSource.data.filter(item => item.selected).length;
  }
  getPromoteCount(): number {
    if (!this.dataSource?.data) {
      return 0;
    }
    return this.dataSource.data.filter(item => item.promoteSelected).length;
  }
  closeMatdialog(){
    this._matDialog.closeAll();
  }
}

export class FirstYearStudentDataSource extends DataSource<any> {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  data: Array<any> = []
  
  constructor(
    private _studentsService: StudentsService
  ) {
    super();
  }

  connect(): Observable<any[]> {
    return this._studentsService.onStudentLecturerGridChanged;
  }

  disconnect(): void {
  }

  loadData(gridFilter: LecturerStudentGrid): void {
    this.loadingSubject.next(true);
    
    // Log the filter being used
    
    this._studentsService.getStudentLecturerForGrid(gridFilter)
      .pipe(
        catchError((error) => {
          console.error('Error loading grid data:', error);
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        this.data = response.data;

        this.paginationData = {
          count: response.totalCount || 0,
          pageNumber: response.currentPage || 1,
          pageSize: response.pageSize || 10
        };
        console.log(gridFilter,response,"response")
        
      });
  }
}