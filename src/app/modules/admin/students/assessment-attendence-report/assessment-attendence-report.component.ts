import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, filter, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { StudentsService } from '../student.service';
import { BatchService } from '../../Batch/batch.service';
import { yearGrid, importUser, ExceluserFeild, AttendanceyearGrid, assessmentGrid } from '../student.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-assessment-attendence-report',
  standalone: true,
  imports: [CommonModule, MatNativeDateModule , MatDatepickerModule, MatPaginator, MatInputModule, ReactiveFormsModule, MatSelectModule, FormsModule, MatFormFieldModule, MatTabsModule, MatTableModule, MatIconModule],
  providers: [StudentService, XlsxToJsonService,DatePipe],
  templateUrl: './assessment-attendence-report.component.html',
  styleUrl: './assessment-attendence-report.component.scss'
})
export class AssessmentAttendenceReportComponent  implements OnInit {
  // years: any;
  batchId: string;
  displayedColumns: string[] = ['Date', 'Theory', 'Practical', 'Total', 'Modify'];
  AttendancedisplayedColumns: string[] = ['Date', 'Theory', 'Practical', 'Modify'];
  dataSource: AssessmentDataSource;
  AttendancedataSource: AttendanceDataSource;
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
  ShowInput: boolean = false;
  parsedData: any[] = [];
  inputFileName: string;
  currentPageSize: number = SitePreference.PAGE.GridRowViewCount;
  currentPageIndex: number = 0;
  studentDetail:any;
  subjects:any;
  apiResponse:any;
  studentId:string;
  batchYearId:string;
  Subject: FormControl;  
  BulkSubject: FormControl;  
  BulkDate: FormControl;  
  IANo: FormControl
  @ViewChild('bulkUpload') bulkUpload!: ElementRef;
  @ViewChild('apiResponsePopup') apiResponsePopup!: ElementRef;
  @ViewChild('editAssessment') editAssessment!: ElementRef;
  @ViewChild('editAttendance') editAttendance!: ElementRef;

  currentAssessment:any
  currentAttendance:any

  UpdateAssessment : FormGroup
  UpdateAttendance : FormGroup

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Add these properties for attendance sorting
  attendanceSortColumn: string = '';
  attendanceSortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    public _matDialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private _formBuilder: FormBuilder,
    private _studentService: StudentService,
    private _studentsService: StudentsService,
  ) {

    this.Subject = new FormControl('0');
    this.BulkSubject = new FormControl('0');
    let CurrentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    this.BulkDate = new FormControl(new Date(CurrentDate));
    this.IANo = new FormControl('1');
    
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      // Reset state when navigating to this component
      this.resetComponentState();
      this.batchId = this._route.snapshot.params['guid'];
      this.studentId = this._route.snapshot.params['id'];
      this.batchYearId = this._route.snapshot.params['batchYearId'];
      this.loadBatchData();
    });
    
    this._route.params.subscribe(res => {
      console.log(res,"res")
      // If batchId changes, reset state
      if (this.batchId !== res.guid) {
        this.resetComponentState();
        this.batchId = res.guid;
        this.studentId = res.id;
        this.batchYearId = res.batchYearId;
        this.loadBatchData();
      }
    });
    this._studentsService.getStudentDetailsById(this.studentId).then(res=>{
      this.studentDetail = res;
    });
    this.UpdateAssessment = this._formBuilder.group({
      Theory : ['',Validators.required],
      Practical : ['',Validators.required],
      TotalMarks : ['',Validators.required],
    })
    this.UpdateAttendance = this._formBuilder.group({
      Theory : ['',Validators.required],
      Practical : ['',Validators.required]
    })
    
    
  }
  CloseDialog(){
    this.apiResponse = [];
    this._matDialog.closeAll();
  }
  Search(){
    this._studentsService.onAssessmentGridChanged.next(true);
    this._studentsService.onAttendanceGridChanged.next(true);
  }
  // New method to reset component state
  resetComponentState() {
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
    this._studentsService.getSubjectbyBatchYear(this.batchYearId).subscribe(res=>{
      if(res){
        this.subjects = res;
        this.Subject.patchValue(res[0].id);
        this.BulkSubject.patchValue(res[0].id);
        this.loadAssessmentData();
        this.loadAttendanceData();
      }
      
    })
      
  }
  OpenDialog(templateRef: any): MatDialogRef<any> { 
   let dialogRef: MatDialogRef<any>;
    
        dialogRef = this.dialog.open(templateRef, {
            panelClass: 'bulk-upload',
            // disableClose: true
        });
        return dialogRef; 
    
  }
  UploadSheet(){
    this.ShowInput = true;
  }
  removeFields(){
    this.ShowInput = false;
    if (this.files) {
      this.files = []
    }
  }
  
  // New method to load student data
  loadAssessmentData() {   
    let gridFilter: assessmentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: this.sortColumn === 'Total' ? 'Total' : this.sortColumn,
      sortOrder: this.sortDirection,
      subjectId: parseInt(this.Subject?.value),
      studentId: this.studentId
    };    
    this.dataSource?.loadData(gridFilter);
  }
  loadAttendanceData() {
    let gridFilter: AttendanceyearGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: this.attendanceSortColumn,
      sortOrder: this.attendanceSortDirection,
      subjectId: parseInt(this.Subject?.value),
      studentId: this.studentId
    };
    this.AttendancedataSource?.loadData(gridFilter);
  }
  
  getNext(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    
    let gridFilter: assessmentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      subjectId: parseInt(this.Subject?.value),
      studentId: this.studentId
    };
    this.dataSource.loadData(gridFilter);
  }
  getNextAttendance(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    
    let gridFilter: AttendanceyearGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      subjectId: parseInt(this.Subject?.value),
      studentId: this.studentId
    };
    this.AttendancedataSource.loadData(gridFilter);
  }
  
  BulkUpload(event) {
    if (this.fileUpload && this.fileUpload.nativeElement) {
      this.fileUpload.nativeElement.click();
    }
  }
  
  validate(file: File) {
    for (const f of this.files) {
      if (f.name === file.name
        && f.lastModified === file.lastModified
        && f.size === f.size
        && f.type === f.type
      ) {
        return false
      }
    }
    return true
  }
  
  public result: any;
  
  clearInputElement() {
    if (this.fileUpload && this.fileUpload.nativeElement) {
      this.fileUpload.nativeElement.value = '';
    }
  }
  
  isMultiple(): boolean {
    return this.multiple
  }
  
  SortOrder(results: any) {
    return results.sort(function (id1, id2) {
      return id1.QueueID - id2.QueueID;
    });
  }
  
  onFileSelected(event: any) {
    this.files = [];
    const file = event.target.files[0];
    if (file) {
      const object = {};
      this.xlsxToJsonService.processFileToJson(object, file).subscribe((jsonData: any) => {
        console.log(jsonData,"jsonData")
        const sheetData = jsonData.sheets.Sheet1; // Access Sheet1
        // Map the parsed data to the required structure
        this.parsedData = sheetData.map((item: any) => {
          return {
              cumulativeDate: this.BulkDate?.value,
              registrationNo: item.RollNo.toString(),
              totalTheory: item.Theory.toString(),
              totalPractical: item.Practicals.toString(),
              totalMarks: item.TotalAssessment,
              theoryAttendance: item.AttendanceTheory,
              practicalAttendance: item.AttendancePractical,
              academics:'',
              CreatedBy:''
          };
      });
        console.log('Mapped Data:', this.parsedData);
      });
      this.files.push(file);
    }
  }
  
  handleFile(event) {
    var self = this;
    let file = event.target.files[0];
    try {
      this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
        this.result = data['sheets'].Sheet1;

        if (!this.result) {
          this.result = data['sheets'];
          if (this.result.data) {
            this.result = this.result.data;
          }
        }
        self.users = [];

        var r: importUser = new importUser({});

        self.result.forEach((row: ExceluserFeild) => {
          if (row.UserName) {
            if (row.Email) {
              if (r.UserName && r.TenantId) {
                self.users.push(r);
                r = new importUser({});
              }

              r.UserName = row.UserName;
              r.Email = row.Email;
              r.Mobile = row.Mobile;
              r.Password = row.Password;
              r.IsActive = row.Active;
              r.RoleID = row.RoleID;
              r.TenantId = row.TenantId;
            }
            else {
              this._studentsService.openSnackBar("wrong Forment Please check", "Close");
            }
          }
        });

        if (r.UserName) {
          self.users.push(r);
          r = new importUser({});
        }
        self.users = self.SortOrder(self.users);
      })
    }
    catch (e) {
      console.error('Error handling file:', e);
    }
    finally {
    }
  }
  
  removeFile(event, file) {
    let ix
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1)
      this.clearInputElement();
    }
  }
  
  OnBulkUpdateusers() {
    if (this.parsedData.length > 0) {
      console.log('Uploading data:', this.parsedData);
      // Send the parsed and mapped JSON data to the API
      let formattedDate = new Date(this.BulkDate?.value).toISOString().split('T')[0];
      console.log(this.BulkDate?.value.toLocaleString().split(',')[0],"this.BulkDate?.value")
      this._studentsService.bulkAssessmentandAttendanceReport(formattedDate, this.BulkSubject?.value, this.IANo?.value, this.parsedData).then(response => {
        if (response) {
          this.apiResponse = response;
          this.OpenDialog(this.apiResponsePopup);
          this.removeFields();
          this._studentsService.onAssessmentGridChanged.next(true);
          this._studentsService.onAttendanceGridChanged.next(true);
          // Clear the file input and data after successful upload
          this.files = [];
          this.parsedData = [];
          this.clearInputElement();
        }
      }, error => {
        console.error('Bulk upload failed', error);
      });
    } else {
      console.error('No data to upload');
      this._studentsService.openSnackBar("No data to upload", "Close");
    }
  }
  
  ngOnInit(): void {
    this.dataSource = new AssessmentDataSource(this._studentsService);
    this.AttendancedataSource = new AttendanceDataSource(this._studentsService);
    
    // Make sure the paginator is initialized with default values
    if (this.paginator) {
      this.paginator.pageIndex = this.currentPageIndex;
      this.paginator.pageSize = this.currentPageSize;
    }
    
    // Initial load handled by constructor and loadBatchData method
    
    this._studentsService.onAssessmentGridChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {
        // Reset pagination to first page when data is refreshed
        this.currentPageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.loadAssessmentData();
      });
    this._studentsService.onAttendanceGridChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(search => {
      // Reset pagination to first page when data is refreshed
      this.currentPageIndex = 0;
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
      this.loadAttendanceData();
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
    if (this.AttendancedataSource) {
      this.AttendancedataSource.disconnect();
    }
  }
  
  yearSelected(event: any) {      
      // Reset pagination when changing year
      this.currentPageIndex = 0;
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }      
      this.loadAssessmentData();
      this.loadAttendanceData();
      
  }
  
  deleteAttendance(user) {
    this._studentsService.deleteAttendance(user.id).subscribe(res=>{
      this._studentsService.onAttendanceGridChanged.next(true);
      this._studentsService.openSnackBar('Attendance Deleted','close')
    })
  }
  deleteAssessment(user) {
    this._studentsService.deleteAssessment(user.id).subscribe(res=>{
      this._studentsService.onAssessmentGridChanged.next(true);
      this._studentsService.openSnackBar('Assessment Deleted','close')
    })
  }
  
  editAssessments(user: any) {
   this.OpenDialog(this.editAssessment);
   this.currentAssessment = user;
   this.UpdateAssessment.patchValue({
    Theory: user.totalTheory,
    Practical: user.totalPractical,
    TotalMarks: user.totalMarks,
   })
  }
  editAttendances(user: any) {
    this.OpenDialog(this.editAttendance);
    this.currentAttendance = user;
    this.UpdateAttendance.patchValue({
     Theory: user.theoryAttendance,
     Practical: user.practicalAttendance
    })
   }
  updateAssessment(){
    let req = {
      id: this.currentAssessment.id,
      cumulativeDate: this.currentAssessment.cumulativeDate,
      subjectId: this.currentAssessment?.subjectId,
      studentId: this.currentAssessment?.studentId,
      studentName: this.currentAssessment?.studentName,
      totalTheory: this.UpdateAssessment.get('Theory').value,
      totalPractical: this.UpdateAssessment.get('Practical').value,
      totalMarks: parseInt(this.UpdateAssessment.get('TotalMarks').value),
    }
    this._studentsService.updateAssessment(req).subscribe(res=>{
        this._studentsService.openSnackBar("Assessment Updated","close");
        this._studentsService.onAssessmentGridChanged.next(true);
        this.CloseDialog();
    })
  }
  updateAttendance(){
    let req = {
      id: this.currentAttendance.id,
      cumulativeDate: this.currentAttendance.cumulativeDate,
      subjectId: this.currentAttendance?.subjectId,
      studentId: this.currentAttendance?.studentId,
      studentName: this.currentAttendance?.studentName,
      theoryAttendance: parseInt(this.UpdateAttendance.get('Theory').value),
      practicalAttendance: parseInt(this.UpdateAttendance.get('Practical').value)
    }
    this._studentsService.updateAttendance(req).subscribe(res=>{
        this._studentsService.openSnackBar("Attendance Updated","close");
        this._studentsService.onAttendanceGridChanged.next(true);
        this.CloseDialog();
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
      this._studentsService.onFirstYearGridChanged.next(true);
    })
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadAssessmentData();
  }

  // Add new method for attendance sorting
  sortAttendanceData(column: string) {
    if (this.attendanceSortColumn === column) {
      this.attendanceSortDirection = this.attendanceSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.attendanceSortColumn = column;
      this.attendanceSortDirection = 'asc';
    }
    this.loadAttendanceData();
  }
}

export class AssessmentDataSource extends DataSource<any> {
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
    return this._studentsService.onAssessmentGridChanged;
  }

  disconnect(): void {
  }

  loadData(gridFilter: assessmentGrid): void {
    this.loadingSubject.next(true);
    
    // Log the filter being used
    
    this._studentsService.getAssessmentForGrid(gridFilter)
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
        
      });
  }
}
export class AttendanceDataSource extends DataSource<any> {
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
    return this._studentsService.onAttendanceGridChanged;
  }

  disconnect(): void {
  }

  loadData(gridFilter: AttendanceyearGrid): void {
    this.loadingSubject.next(true);
    
    // Log the filter being used
    
    this._studentsService.getAttendanceForGrid(gridFilter)
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
        
      });
  }
}