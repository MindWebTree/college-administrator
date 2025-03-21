import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BatchService } from '../batch.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, filter, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { ExceluserFeild, importUser, yearGrid } from '../batch.model';
import { FormControl } from '@angular/forms';
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


@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [CommonModule, MatPaginator, MatTabsModule, MatTableModule, MatIconModule],
  providers: [StudentService, XlsxToJsonService],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.scss'
})
export class BatchListComponent implements OnInit {
  years: any;
  batchId: string;
  selectedYear: any = null; // Initialize as null
  displayedColumns: string[] = ['Name', 'RollNo', 'UpdatedAt', 'Buttons'];
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

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();

  constructor(
    public _matDialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private sanitizer: DomSanitizer,
    private _studentService: StudentService,
    private _batchService: BatchService,
  ) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      // Reset state when navigating to this component
      this.resetComponentState();
      this.batchId = this._route.snapshot.params['guid'];
      this.loadBatchData();
    });
    
    this._route.params.subscribe(res => {
      // If batchId changes, reset state
      if (this.batchId !== res.guid) {
        this.resetComponentState();
        this.batchId = res.guid;
        this.loadBatchData();
      }
    });
  }
  
  // New method to reset component state
  resetComponentState() {
    this.selectedYear = null;
    this.selected.setValue(0);
    this.files = [];
    this.parsedData = [];
    if (this.fileUpload && this.fileUpload.nativeElement) {
      this.fileUpload.nativeElement.value = '';
    }
  }
  
  // New method to load batch data
  loadBatchData() {
    // Load years first
    this._batchService.getYears(this.batchId).subscribe(res => {
      this.years = res;
      
      // After getting years, select the first year by default
      if (this.years && this.years.length > 0) {
        this.selectedYear = this.years[0]?.id;
        
        // Then load student data for the selected year
        this.loadStudentData();
      }
    });
  }
  
  // New method to load student data
  loadStudentData() {
    let gridFilter: yearGrid = {
      pageNumber: 1,
      pageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator?.pageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      averageType: "",
      average: 0,
      batchId: this.batchId,
      batchYearId: this.selectedYear
    };
    this.dataSource.loadData(gridFilter);
  }
  
  getNext(event: PageEvent) {
    let gridFilter: yearGrid = {
      pageNumber: event.pageIndex + 1,
      pageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator?.pageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      averageType: "",
      average: 0,
      batchId: this.batchId,
      batchYearId: this.selectedYear
    };
    this.dataSource.loadData(gridFilter);
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
    this.fileUpload.nativeElement.value = ''
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
        const sheetData = jsonData.sheets.Sheet1; // Access Sheet1
        // Map the parsed data to the required structure
        this.parsedData = sheetData.map((item: any) => {
          const nameParts = item.Name.trim().split(' ')
          // Last part is the last name
          const lastName = nameParts.pop();

          // Join the remaining parts as the first name
          const firstName = nameParts.join(' ');
          return {
            firstName: firstName,
            lastName: lastName,
            email: item.Email.toString(),
            phoneNumber: item.MobileNumber.toString(),
            rollNo: item.RollNo.toString(),
            password: item.Password.toString(),
            batchId: item.Batch,
            batchYearId: item.BatchYear,
            parentEmail: item.ParentEmail.toString(),
            parentPhoneNumber: item.ParentMobileNumber.toString(),
            CourseType: "",
            ImageUrl: "",
            MedicalCourseYear: "",
            PhoneCountryCode: "",
            isActive: true
          }
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
              this._batchService.openSnackBar("wrong Forment Please check", "Close");
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
      console.log(this.parsedData, "parsedData")
      // Send the parsed and mapped JSON data to the API
      this._batchService.bulkUploadUsers(this.batchId, this.selectedYear, this.parsedData).then(response => {
        if (response) {
          this._batchService.onFirstYearGridChanged.next(true);
        }
      }, error => {
        console.error('Bulk upload failed', error);
      });
    } else {
      console.error('No data to upload');
    }
  }
  
  ngOnInit(): void {
    this.dataSource = new FirstYearStudentDataSource(this._batchService);
    
    // Initial load handled by constructor and loadBatchData method
    
    this._batchService.onFirstYearGridChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {
        this.loadStudentData();
      });
  }
  
  ngOnDestroy() {
    this._unsubscribeAll?.next();
    this._unsubscribeAll?.complete();
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  
  yearSelected(event: any) {
    if (this.years && this.years.length > 0) {
      this.selectedYear = this.years[event]?.id;
      this.loadStudentData();
    }
  }
  
  deleteStudent(user) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._studentService.deleteStudent(user.id);
        this._batchService.onFirstYearGridChanged.next(true);
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
        this._batchService.onFirstYearGridChanged.next(true);
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
      this._batchService.onFirstYearGridChanged.next(true);
    })
  }
}

export class FirstYearStudentDataSource extends DataSource<any> {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  data: Array<any> = []
  
  constructor(
    private _batchService: BatchService
  ) {
    super();
  }

  connect(): Observable<any[]> {
    return this._batchService.onFirstYearGridChanged;
  }

  disconnect(): void {
  }

  loadData(gridFilter: yearGrid): void {
    this.loadingSubject.next(true);
    this._batchService.getStudentForGrid(gridFilter)
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