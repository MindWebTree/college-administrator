import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, filter, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { SitePreference } from 'app/core/auth/app.configs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { GridFilter, lecturerGrid } from '../../common/gridFilter';
import { HODService } from '../HOD.service';
import { HODModel } from '../HOD.model';
import { CreateHODComponent } from '../create-hod/create-hod.component';
import { XlsxToJsonService } from '../../common/xlsToJSON';


@Component({
  selector: 'app-list-hod',
  standalone: true,
  imports: [MatPaginatorModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule, MatButtonModule, OverlayModule, FormsModule],
  templateUrl: './list-hod.component.html',
  styleUrl: './list-hod.component.scss'
})
export class ListHODComponent {

  lectureManagement: any;
  @ViewChild('dialogContent', { static: true })
  dialogContent: TemplateRef<any>;
  _sitePreference: any = SitePreference;
  searchInput: FormControl;
  Subject: FormControl;
  BulkYear: FormControl;
  BulkSubject: FormControl;
  paginationData: any;
  private rawFileData: any[] = [];

  dataSource: HODManagementDataSource;


  dialogRef: any;
  subjects: any;
  subject: any;
  years: any;


  currentSearchText: string = ''; // added by harsh to track current search
  courseyearId: string = '';
  CourseYear: string = '';
  inputFileName: string;
  @Input() files: File[] = [];
  @Input() multiple;
  parsedData: any[] = [];
  @ViewChild('fileUpload') fileUpload: ElementRef;
  accept: string = '.xlsx, .xls';

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public _matDialog: MatDialog,
    public _route: ActivatedRoute,
    public xlsxToJsonService: XlsxToJsonService,
    public _formBuilder: FormBuilder,
    private _HODservice: HODService, private _router: Router) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      this.courseyearId = this._route.snapshot.params['guid'];
      this.loadStudentData();
      this.getSubjects();
    });
    this._route.params.subscribe(res => {
      this.courseyearId = res.guid;
      this.loadStudentData()
    })
    this.searchInput = new FormControl('');
    this.Subject = new FormControl('0');
    this.BulkYear = new FormControl('0');
    this.BulkSubject = new FormControl('0');
    
    
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
  
  // onFileSelected(event: any) {
  //   let year = this.years.find(y=>y.guid == this.BulkYear?.value)?.id
  //   this.files = [];
  //   const file = event.target.files[0];
  //   if (file) {
  //     const object = {};
  //     this.xlsxToJsonService.processFileToJson(object, file).subscribe((jsonData: any) => {
  //       const sheetData = jsonData.sheets.Sheet1; // Access Sheet1
  //       // Map the parsed data to the required structure
  //       this.parsedData = sheetData.map((item: any) => {
  //         const nameParts = item.Name.trim().split(' ')
  //         // Last part is the last name
  //         const lastName = nameParts.pop();

  //         // Join the remaining parts as the first name
  //         const firstName = nameParts.join(' ');
  //         return {
  //           firstName: firstName,
  //           lastName: lastName,
  //           email: item.Email.toString(),
  //           phoneNumber: item.MobileNumber.toString(),
  //           password: item.Password.toString(),
  //           description: item.Description,
  //           qualification: item.Description,
  //           emailConfirmed: true,
  //           phoneNumberConfirmed: true,
  //           employeeNo: item.RollNo.toString(),
  //           phoneCountryCode: '+91',
  //           courseType:'',
  //           courses: [
  //             {
  //               courseId: 325,
  //               courseYearId: parseInt(year),
  //               courseYear: '',
  //               courseName: ''
  //             }
  //           ],
  //           subjectIds: [
  //             parseInt(this.BulkSubject?.value)
  //           ],
  //           isActive: true
  //         }
  //       });
  //       console.log('Mapped Data:', this.parsedData);
  //     });
  //     this.files.push(file);
  //   }
  // }
  onFileSelected(event: any) {
    this.files = [];
    const file = event.target.files[0];
    if (file) {
      // Just store the file and parse the raw data without mapping yet
      const object = {};
      this.xlsxToJsonService.processFileToJson(object, file).subscribe((jsonData: any) => {
        const sheetData = jsonData.sheets.Sheet1;
        this.rawFileData = sheetData; // Store the raw data
        this.files.push(file);
      });
    }
  }
  removeFile(event, file) {
    let ix
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1)
      this.clearInputElement();
    }
  }
  
  // OnBulkUpdateusers() {
  //   if (this.parsedData.length > 0) {
  //     console.log('Uploading data:', this.parsedData);
  //     // Send the parsed and mapped JSON data to the API
  //     this._HODservice.bulkUploadHOD(this.parsedData).then(response => {
  //       if (response) {
  //         this._HODservice.onHODManagementChanged.next(true);
  //         // Clear the file input and data after successful upload
  //         this.files = [];
  //         this.parsedData = [];
  //         this.clearInputElement();
  //       }
  //     }, error => {
  //       console.error('Bulk upload failed', error);
  //     });
  //   } else {
  //     console.error('No data to upload');
  //     this._HODservice.openSnackBar("No data to upload", "Close");
  //   }
  // }
  OnBulkUpdateusers() {
    if (this.rawFileData.length > 0) {
      // Get the current year and subject values
      const yearValue = this.BulkYear.value;
      const subjectValue = this.BulkSubject.value;
      const year = this.years.find(y => y.guid == yearValue)?.id;
      
      console.log('Current year:', yearValue, 'Current subject:', subjectValue);
      
      // Map the raw data to the required structure with current form values
      this.parsedData = this.rawFileData.map((item: any) => {
        const nameParts = item.Name.trim().split(' ');
        const lastName = nameParts.pop();
        const firstName = nameParts.join(' ');
        
        return {
          firstName: firstName,
          lastName: lastName,
          email: item.Email.toString(),
          phoneNumber: item.MobileNumber.toString(),
          password: item.Password.toString(),
          description: item.Description,
          qualification: item.Description,
          emailConfirmed: true,
          phoneNumberConfirmed: true,
          employeeNo: item.RegisteredNo.toString(),
          phoneCountryCode: '+91',
          courseType: '',
          courses: [
            {
              courseId: 325,
              courseYearId: parseInt(year),
              courseYear: '',
              courseName: ''
            }
          ],
          subjectIds: [
            parseInt(subjectValue)
          ],
          isActive: true
        };
      });
      
      console.log('Final payload:', this.parsedData);
      
      // Send the data to API
      this._HODservice.bulkUploadHOD(this.parsedData).then(response => {
        if (response) {
          this._HODservice.onHODManagementChanged.next(true);
          this.files = [];
          this.parsedData = [];
          this.rawFileData = []; // Clear the raw data as well
          this.clearInputElement();
        }
      }, error => {
        console.error('Bulk upload failed', error);
      });
    } else {
      console.error('No data to upload');
      this._HODservice.openSnackBar("No data to upload", "Close");
    }
  }

  loadStudentData() {
    this._HODservice.onHODManagementChanged.next(true)
    // this._HODservice.getCourseYearName(this.courseyearId).subscribe((res: any) => {
    //   this.CourseYear = res.name
    // })
  }
  Search(){
    this._HODservice.onHODManagementChanged.next(true)
  }


  deleteLecture(user) {

    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false

    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._HODservice.deleteLecture(user.id);

      }
      this.confirmDialogRef = null;
    });
  }
  loadPage() {
    this._HODservice.onHODManagementChanged.next(this.lectureManagement);
  }


  getNext(event: PageEvent) {
    this._HODservice.onHODManagementChanged.next(this.lectureManagement);

  }

  GetYears(){
    this._HODservice.getCourseYear().subscribe(res=>{
      this.years = res;  
      if (res && res.length > 0) {    
      this.BulkYear.setValue(res[0]?.guid);
      this.SelectYear(res[0]?.guid)
      }
    })
  }
  SelectYear(yearGuid){
    this._HODservice.getSubjectbyAcademicYear(yearGuid).subscribe(res=>{

    if (res && res.length > 0) {
      this.subject = res;
      this.BulkSubject.setValue(res[0]?.id);
    }
    })
  }
 


  onSortData(sort: Sort) {

    this._HODservice.onHODManagementChanged.next(this.lectureManagement);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  getSubjects(){
    this._HODservice.getSubjectbyAcademicYear(this.courseyearId).subscribe(res=>{
      this.subjects =res;
    })
  }
  ngOnInit(): void {
    this.GetYears();
    this.dataSource = new HODManagementDataSource(this._HODservice);

    this._HODservice.onHODManagementChanged
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
        this._HODservice.onHODManagementChanged.next(searchText);
      });
  }


  addLecture() {

    var lecturer = new HODModel({});
    this.dialogRef = this._matDialog.open(CreateHODComponent, {
      panelClass: 'lecture-form-dialog',
      disableClose: true,
      data: {
        action: 'new',
        lecturer: lecturer,
      }
    });
  }

  editLecturer(leacturer: any): void {

    this._HODservice.getLectureDetailsById(leacturer.id).then(response => {
      this.dialogRef = this._matDialog.open(CreateHODComponent, {
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

export class HODManagementDataSource extends DataSource<HODModel> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  data: Array<HODModel> = []
  /**
   * Constructor
   *
   * @param {LectureService} _HODservice
   */
  constructor(
    private _HODservice: HODService
  ) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._HODservice.onHODManagementChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }

  loadData(gridFilter: GridFilter): void {
    this.loadingSubject.next(true);
    this._HODservice.getHODForGrid(gridFilter)
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