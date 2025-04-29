import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { CompetencyService } from '../competency.service';
import { competencyGrid, studentCompetecyGrid } from '../competency.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SitePreference } from 'app/core/auth/app.configs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubmissionFormComponent } from '../submission-form/submission-form.component';
import { helperService } from 'app/core/auth/helper';

@Component({
  selector: 'app-student-competency-list',
  standalone: true,
  imports: [MatSelectModule, CommonModule, MatPaginatorModule, MatMenuModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatIconModule],
  templateUrl: './student-competency-list.component.html',
  styleUrl: './student-competency-list.component.scss'
})
export class StudentCompetencyListComponent implements OnInit {
  completedAssignment: any;
  academicYears: any;
  private _unsubscribeAll: Subject<void>;
  ListCompetencyFilters: FormGroup;
  searchInput: FormControl;
  currentSearchText: string;
  paginationData: any;   
  batches:any;
  _sitePreference: any = SitePreference;
  confirmDialogRef:MatDialogRef<any>;
  userDetails: any;

  @ViewChild('completedPaginator', { static: true }) completedpaginator: MatPaginator;
  
  constructor(
    private _competencyService: CompetencyService,
    private _router: Router,
    private _matDialog: MatDialog,
    private _helperService: helperService,
    private _formBuilder: FormBuilder,
  ) {
    this._unsubscribeAll = new Subject<void>();
    this._competencyService.getBatch().subscribe(res => {
      this.batches = res;
    });
    this._competencyService.getBatchYear('50b9438f-03bb-11f0-84dc-40b034f2b31c').subscribe(res => {
      this.academicYears = res;
    });
    
    this.ListCompetencyFilters = this._formBuilder.group({
      BatchYear: ['0'],
      AcademicYear: ['0']
    });
    
    this.searchInput = new FormControl('');
    this.userDetails = this._helperService.getUserDetail();
    console.log(this.userDetails?.Roles,"");
  }
  SubmitAssignment(){
    this.confirmDialogRef = this._matDialog.open(SubmissionFormComponent, {
      data:'hi',
      panelClass:'submit-assignment'
    });
  }
  
  Search() {
    this._competencyService.onStudentCompetecyGridChanged.next(true);
  }
  
  getNext(event: PageEvent) {
    this._competencyService.onStudentCompetecyGridChanged.next(true);
  }
  
  
  ngOnInit(): void {
    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this.currentSearchText = searchText;
        this._competencyService.onStudentCompetecyGridChanged.next(true);
      }); 
  

    this._competencyService.onStudentCompetecyGridChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(ress => {
      let req: studentCompetecyGrid = {
        keyword: "",
        pageNumber: this.completedpaginator.pageIndex + 1,
        pageSize: this.completedpaginator.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.completedpaginator.pageSize,
        orderBy: '',
        sortOrder: '',
        averageType: null,
        average: 0,
        batchId: null,
        batchYearId: 0,
        subjectId: 0,
        teamId: 0
      }
      this._competencyService.getStudentCompetencyGrid(req).then(res => {
        this.completedAssignment = res?.data;
        this.paginationData = {
          count: res.totalCount || 0,
          pageNumber: res.currentPage || 1,
          pageSize: res.pageSize || 10
        };
      })
    });

    
  }
  GetCertificate(id){
    this._router.navigate([`/certificate/${id}`])
  }
      
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}