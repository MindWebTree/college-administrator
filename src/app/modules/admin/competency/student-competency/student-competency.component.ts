import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SubmissionFormComponent } from '../submission-form/submission-form.component';
import { CompetencyService } from '../competency.service';
import { CompetencyRating, StudentGrid } from '../competency.model';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SitePreference } from 'app/core/auth/app.configs';
import { ActivatedRoute } from '@angular/router';
import { HistoryAssignmentComponent } from '../history-assignment/history-assignment.component';

@Component({
  selector: 'app-student-competency',
  standalone: true,
  imports: [MatIconModule, MatPaginatorModule, MatMenuModule, CommonModule],
  templateUrl: './student-competency.component.html',
  styleUrl: './student-competency.component.scss'
})
export class StudentCompetencyComponent implements OnInit {
  confirmDialogRef: MatDialogRef<any>;
  students:any;
  private _unsubscribeAll: Subject<void>;
  paginationData: any;  
  @ViewChild('Paginator', { static: true }) paginator: MatPaginator;
  competencyGuid:string;
  _sitePreference: any = SitePreference;
  competencyDetail:any;
  dataLoaded:boolean=false;

  constructor(
    private _matDialog : MatDialog,
    private _route : ActivatedRoute,
    private _location : Location,
    private _competencyService : CompetencyService
  ){
    this._unsubscribeAll = new Subject<void>();
    this._route.params.subscribe(res=>{
      this.competencyGuid = res.guid;
    })
  }
  getRatingLabel(attempt: number): string {
    return CompetencyRating[attempt] || 'None';
  }

  getNext(event: PageEvent) {
    this._competencyService.onSubjectGridChanged.next(true);
  }
  ngOnInit(): void {
    this._competencyService.onCompetencyStudentChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this._competencyService.getAssignmentbyid(this.competencyGuid).then(res => {
        this.competencyDetail = res;
        this.dataLoaded = true;
      });
    })
   
    this._competencyService.onSubjectGridChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      let req: StudentGrid = {
        keyword: "",
        pageNumber: this.paginator.pageIndex + 1,
        pageSize: this.paginator.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
        orderBy: '',
        sortOrder: '',
        competencyAssignmentGuid: this.competencyGuid
      }
      this._competencyService.getStudentGrid(req).then(res => {
        this.students = res?.data;
        this.paginationData = {
          count: res.totalCount || 0,
          pageNumber: res.currentPage || 1,
          pageSize: res.pageSize || 10
        };
      })
    })
  }
  back(){
    this._location.back();
  }

  SubmitAssignment(student){
    this.confirmDialogRef = this._matDialog.open(SubmissionFormComponent, {
      data:student,
      panelClass:'submit-assignment'
    });
  }
  HistoryAssignment(student){
    this.confirmDialogRef = this._matDialog.open(HistoryAssignmentComponent, {
      data:student,
      panelClass:'history-assignment'
    });
  }
  
}
