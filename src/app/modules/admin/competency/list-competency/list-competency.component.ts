import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { CompetencyService } from '../competency.service';
import { competencyGrid } from '../competency.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SitePreference } from 'app/core/auth/app.configs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubmissionFormComponent } from '../submission-form/submission-form.component';

@Component({
  selector: 'app-list-competency',
  standalone: true,
  imports: [MatSelectModule, CommonModule, MatPaginatorModule, MatMenuModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatIconModule],
  templateUrl: './list-competency.component.html',
  styleUrl: './list-competency.component.scss'
})
export class ListCompetencyComponent implements OnInit {
  completedAssignment: any;
  upcomingAssignment: any;
  academicYears: any;
  private _unsubscribeAll: Subject<void>;
  ListCompetencyFilters: FormGroup;
  searchInput: FormControl;
  currentSearchText: string;
  paginationData: any;  
  upcomingpaginationData: any;  
  batches:any;
  _sitePreference: any = SitePreference;
  confirmDialogRef:MatDialogRef<any>;

  @ViewChild('completedPaginator', { static: true }) completedpaginator: MatPaginator;
  @ViewChild('upcomingPaginator', { static: true }) upcomingpaginator: MatPaginator;
  
  constructor(
    private _competencyService: CompetencyService,
    private _router: Router,
    private _matDialog: MatDialog,
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
  }
  SubmitAssignment(){
    this.confirmDialogRef = this._matDialog.open(SubmissionFormComponent, {
      data:'hi',
      panelClass:'submit-assignment'
    });
  }
  
  Search() {
    this._competencyService.onUpcomingAssignment.next(true);
    this._competencyService.onCompletedAssignment.next(true);
  }
  
  getNext(event: PageEvent) {
    this._competencyService.onCompletedAssignment.next(true);
  }
  Start(assignment){
    this._router.navigate([`/competency/student-grid/${assignment.guid}`]);
  }
  
  getNextUpcoming(event: PageEvent) {
    this._competencyService.onUpcomingAssignment.next(true);
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
        this._competencyService.onCompletedAssignment.next(true);
        this._competencyService.onUpcomingAssignment.next(true);
      });
    
    this._competencyService.onUpcomingAssignment.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      let req: competencyGrid = {
        batchId: parseInt(this.ListCompetencyFilters.get('BatchYear').value),
        academicYearId: parseInt(this.ListCompetencyFilters.get('AcademicYear').value) ? parseInt(this.ListCompetencyFilters.get('AcademicYear').value) : 0,
        status: 1,
        conductedBy: '',
        keyword: "",
        pageNumber: this.upcomingpaginator.pageIndex + 1,
        pageSize: this.upcomingpaginator.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.upcomingpaginator.pageSize,
        orderBy: '',
        sortOrder: ''
      }
      this._competencyService.getAssignmentGrid(req).then(res => {
        this.upcomingAssignment = res?.data;
        this.upcomingpaginationData = {
          count: res.totalCount || 0,
          pageNumber: res.currentPage || 1,
          pageSize: res.pageSize || 10
        };
      })
    })

    this._competencyService.onCompletedAssignment.pipe(takeUntil(this._unsubscribeAll)).subscribe(ress => {
      let req: competencyGrid = {
        batchId: parseInt(this.ListCompetencyFilters.get('BatchYear').value),
        academicYearId: parseInt(this.ListCompetencyFilters.get('AcademicYear').value) ? parseInt(this.ListCompetencyFilters.get('AcademicYear').value) : 0,
        status: 3,
        conductedBy: '',
        keyword: "",
        pageNumber: this.completedpaginator.pageIndex + 1,
        pageSize: this.completedpaginator.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.completedpaginator.pageSize,
        orderBy: '',
        sortOrder: ''
      }
      this._competencyService.getAssignmentGrid(req).then(res => {
        this.completedAssignment = res?.data;
        this.paginationData = {
          count: res.totalCount || 0,
          pageNumber: res.currentPage || 1,
          pageSize: res.pageSize || 10
        };
      })
    });

    
  }
  
  editAssignment(assignment) {
    this._router.navigate([`competency/edit/${assignment.guid}`])
  }
  
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}