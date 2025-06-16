import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LectureService } from '../lecturer-management.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, filter, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { ExceluserFeild, importUser, HODStudentGrid  } from '../lecturer-management.model';
import { FormBuilder,Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CreateLecturerComponent } from '../create-lecturer/create-lecturer.component';
import { helperService } from 'app/core/auth/helper';

@Component({
  selector: 'app-batch-subgroup',
  standalone: true,
  imports: [CommonModule, MatPaginator, MatButtonModule, MatSelectModule,  MatTabsModule, MatTableModule, MatIconModule, MatCheckboxModule, ReactiveFormsModule, FormsModule],
  providers: [StudentService, XlsxToJsonService],
  templateUrl: './list-lecturer-v1.component.html',
  styleUrl: './list-lecturer-v1.component.scss'
})
export class ListLecturerV1Component  implements OnInit {
  years: any;
  batchId: string;
  selectedYear: any = null; // Initialize as null
  displayedColumns: string[] = ['Name', 'MobileNo','Qualification','AssignedTeam','Buttons', 'Bio']
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
  parentteams:any;
  filteredteams:any;
  Team: FormControl;  
  ParentTeam: FormControl;  
  @ViewChild('assignTeam') assignTeam!: ElementRef;
  @ViewChild('promoteToNextYear') promoteToNextYear!: ElementRef;
  lecturer_teams: any[] = [];
  lecturers: any[] = [];
  Hod:any
  Batches: any[] = [];
  assignTeamForm:FormGroup;

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  selectedStudentIds: any[];
  selectedPromoteStudentIds: any[];
  constructor(
    public _matDialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private _helperService: helperService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private _lectureService: LectureService,
    private formbuilder:FormBuilder,
  ) {
    this._lectureService.getTeams().subscribe(res=>{
      this.teams = res.filter(res => res.parentTeamId !== 0);
      
    })
    this.assignTeamForm = this.formbuilder.group({
      teamId: ['', Validators.required],
      lecturerId: ['', Validators.required],
      batchGuid: ['', Validators.required],
      BatchYearId: [0, Validators.required],
      subjectId: [0, Validators.required]
    });
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
   
    this._lectureService.getYears(this.batchId).subscribe(res => {
      this.years = res;
      
      // After getting years, select the first year by default
      if (this.years && this.years.length > 0) {
        this.selectedYear = this.years[0]?.id;
        
        // Then load student data for the selected year
        this.loadStudentData();
      }
    });
  }
  
  onSubmit() {
    if (this.assignTeamForm.invalid) {
      this.assignTeamForm.markAllAsTouched(); // Mark all fields as touched to show errors
      return;
    }
    if (this.assignTeamForm.valid) {  
      const formData = {
        teamId: this.assignTeamForm.value.teamId,
        lecturerId: [this.assignTeamForm.value.lecturerId], // Convert to array manually
        batchGuid: this.assignTeamForm.value.batchGuid,
        BatchYearId: this.assignTeamForm.value.BatchYearId,
        subjectId: this.assignTeamForm.value.subjectId
      }; 
      this.assignLeaturerTeam(formData);
    } else {
      console.log("Form is invalid");
    }
  }
  assignLeaturerTeam(formData: any) {
 

    // Call service method
    this._lectureService.AssignTeam(formData).subscribe({
      next: (response) => {
        this._matDialog.closeAll();
        this._lectureService.onLecturerGridChanged.next(true);
      },
      error: (error) => {
        console.error('Error assigning team', error);
      }
    });
  }
 
  // New method to load student data
  loadStudentData() {
    
    let gridFilter: HODStudentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
      courseYearId:null,
      batchGuid:this.batchId,    
      subjectId:0,
    };
    
    this.dataSource.loadData(gridFilter);
  }
  SubjectSelected(){
    let gridFilter: HODStudentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
     courseYearId:null,
     batchGuid:this.batchId,    
      subjectId:0,
    };
    
    this.dataSource.loadData(gridFilter);
  }
  
  getNext(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    
    let gridFilter: HODStudentGrid = {
      pageNumber: this.currentPageIndex + 1,
      pageSize: this.currentPageSize,
      keyword: '',
      orderBy: '',
      sortOrder: '',
     courseYearId:null,
     batchGuid:this.batchId,    
      subjectId:0,
    };
    this.dataSource.loadData(gridFilter);
  }
  OpenDialog(templateRef: any): MatDialogRef<any> {
    return this.dialog.open(templateRef, {
      panelClass: 'assign-tema',
      width: '500px',
      // disableClose: true
    });
  }
  onCancel(): void {
    this._matDialog.closeAll(); // ✅ This will close the modal
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
            EmployeeNo: item.RollNo.toString(),
            password: item.Password.toString(),
            qualification: item.Qualification.toString(),
            CourseType: "",
            Description: "",
            ImageUrl: "",
            MedicalCourseYear: "",
            PhoneCountryCode: "",
            isActive: true
          }
        });
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
              this._lectureService.openSnackBar("wrong Forment Please check", "Close");
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
      // Send the parsed and mapped JSON data to the API
      this._lectureService.bulkUploadUsers(this.parsedData).then(response => {
        if (response) {
          this._lectureService.onLecturerGridChanged.next(true);
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
      this._lectureService.openSnackBar("No data to upload", "Close");
    }
  }
  
  ngOnInit(): void {
    this.dataSource = new FirstYearStudentDataSource(this._lectureService);

    this.loadLecturers();
    this.loadBatches();
    this.getHod();
    
    
    // Make sure the paginator is initialized with default values
    if (this.paginator) {
      this.paginator.pageIndex = this.currentPageIndex;
      this.paginator.pageSize = this.currentPageSize;
    }
    
    // Initial load handled by constructor and loadBatchData method
    
    this._lectureService.onLecturerGridChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {
        // Reset pagination to first page when data is refreshed
        this.currentPageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
      
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
  //   this._lectureService.getTeams().subscribe(res=>{
  //     this.teams = res;      
  //     this.parentteams = this.teams.filter(t=>t.parentTeamId ==0);
  //     this.ParentTeam = new FormControl(this.parentteams[0].id);
  //     this.GetTeams(this.parentteams[0].id);
  //   })
      
  //   console.log("2");
  //     this.loadStudentData();
  //   }
  // }
  
  deleteStudent(user) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._lectureService.deleteLecture(user.id).subscribe(res=>{
          this._lectureService.onLecturerGridChanged.next(true);
        });
      }
      this.confirmDialogRef = null;
    });
  }
  
 

  // Function to load lecturers
  loadLecturers(): void {
    this._lectureService.getLecturers().subscribe(
      (response) => {
        this.lecturers = response; // Assuming response is an array of lecturers
      },
      (error) => {
        console.error('Error loading lecturers:', error);
      }
    );
  }
  getHod(): void {
    const hodUser = this._helperService.getUserDetail();
    this._lectureService.getLectureDetailsById(hodUser?.Id).then(res=>{
      this.Hod = res;
    })
  }
  loadBatches(): void {
    this._lectureService.getBatch().subscribe(
      (response) => {
        this.Batches = response; // Assuming response is an array of lecturers
      },
      (error) => {
        console.error('Error loading lecturers:', error);
      }
    );
  }

  gotoLecturerBio(element){
    this._router.navigate([`/lecturer/lecturer-bio/${element?.id}`]);
  }
  
  editStudent(user: any) {
    this._lectureService.getLectureDetailsById(user.id).then(response => {
      this.dialogRef = this._matDialog.open(CreateLecturerComponent, {
        panelClass: 'lecture-form-dialog',
        data: {
          lecturer: response,
          action: 'edit'
        }
      });
      this.dialogRef.afterClosed().subscribe(r => {
        this._lectureService.onLecturerGridChanged.next(true);
      })
    })
  }
  
  addStudent() {
    var students = new studentModel({});
    this.dialogRef = this._matDialog.open(CreateLecturerComponent, {
      panelClass: 'lecture-form-dialog',
      disableClose: true,
      data: {
        action: 'new',
        students: students,
      }
    });
    this.dialogRef.afterClosed().subscribe(r => {
      this._lectureService.onLecturerGridChanged.next(true);
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
  //  if(this.selectedStudentIds?.length > 0){
      this.OpenDialog(this.assignTeam);
    // }else{
      //this._lectureService.openSnackBar('Select minimum one Student to Assign Group','close')
    // }
  }
  PromoteToNextYear(){
    if (!this.dataSource?.data) return;
    const selectedRows = this.dataSource.data.filter(row => row.promoteSelected);
    this.selectedPromoteStudentIds = selectedRows.map(row => row.id);
    
    if(this.selectedPromoteStudentIds?.length > 0){
      this.OpenDialog(this.promoteToNextYear);
    }else{
      this._lectureService.openSnackBar('Select minimum one Student to Promote','close')
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
  AssignTeam(){
    let req = {
      studentId: this.selectedStudentIds,
      teamId: this.Team?.value,
      batchGuid: this.batchId,
      batchYearId: 0
    }
    this._lectureService.mapTeam(req).subscribe(res=>{
      this._lectureService.openSnackBar('Team Assigned','close');
      this.closeMatdialog();
      let gridFilter: HODStudentGrid = {
        pageNumber: this.currentPageIndex + 1,
        pageSize: this.currentPageSize,
        keyword: '',
        orderBy: '',
        sortOrder: '',
       courseYearId:null,
       batchGuid:this.batchId,       
        subjectId:0,
      };
      this.dataSource.loadData(gridFilter);
    })
  }
  PromoteToYear() {
    this._lectureService.promoteToNextYear(this.selectedPromoteStudentIds).subscribe(res => {
        this._lectureService.openSnackBar(res, 'close');
        this.closeMatdialog();
        let gridFilter: HODStudentGrid = {
          pageNumber: this.currentPageIndex + 1,
          pageSize: this.currentPageSize,
          keyword: '',
          orderBy: '',
          sortOrder: '',
         courseYearId:null,
         batchGuid:this.batchId,    
      subjectId:0,
      
        };
        this.dataSource.loadData(gridFilter);
    });
  }
}

export class FirstYearStudentDataSource extends DataSource<any> {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  data: Array<any> = []
  
  constructor(
    private _lectureService: LectureService
  ) {
    super();
  }

  connect(): Observable<any[]> {
    return this._lectureService.onLecturerGridChanged;
  }

  disconnect(): void {
  }

  loadData(gridFilter: HODStudentGrid): void {
    this.loadingSubject.next(true);
    
    // Log the filter being used
    
    this._lectureService.getHODStudentForGrid(gridFilter)
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
