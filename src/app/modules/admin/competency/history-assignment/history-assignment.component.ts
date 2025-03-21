import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SubmissionFormComponent } from '../submission-form/submission-form.component';
import { CompetencyService } from '../competency.service';
import { CompetencyRating, StudentGrid } from '../competency.model';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SitePreference } from 'app/core/auth/app.configs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history-assignment',
  standalone: true,
  imports: [MatIconModule, MatPaginatorModule, MatMenuModule, CommonModule],
  templateUrl: './history-assignment.component.html',
  styleUrl: './history-assignment.component.scss'
})
export class HistoryAssignmentComponent implements OnInit {
  confirmDialogRef: MatDialogRef<any>;
  students:any;
  private _unsubscribeAll: Subject<void>;
  paginationData: any;  
  @ViewChild('Paginator', { static: true }) paginator: MatPaginator;
  competencyGuid:string;
  _sitePreference: any = SitePreference;
  competencyDetail:any;
  dataLoaded:boolean=false;
  Studentid:string

  constructor(
    
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog : MatDialog,
    private _route : ActivatedRoute,
    private _competencyService : CompetencyService
  ){
    this._unsubscribeAll = new Subject<void>();
      console.log(_data,"_data")
      this.competencyGuid = _data.competencyGuid;
      this.Studentid = _data.id;
  }
  getRatingLabel(attempt: number): string {
    return CompetencyRating[attempt] || 'None';
  }

  getNext(event: PageEvent) {
    this._competencyService.onHistoryGridChanged.next(true);
  }
  ngOnInit(): void {
    this._competencyService.getAssignmentbyid(this.competencyGuid).then(res=>{
      this.competencyDetail = res;
      this.dataLoaded = true;
    });
    this._competencyService.onHistoryGridChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      let req: StudentGrid = {
        keyword: "",
        pageNumber: 0,
        pageSize: 0,
        orderBy: '',
        sortOrder: '',
        competencyAssignmentGuid: this.competencyGuid
      }
      this._competencyService.getHistoryAssignment(req, this.competencyGuid, this.Studentid).then(res => {
        this.students = res;
        this.paginationData = {
          count: res.totalCount || 0,
          pageNumber: res.currentPage || 1,
          pageSize: res.pageSize || 10
        };
      })
    })
  }

  CheckCriteria(student){
    this.confirmDialogRef = this._matDialog.open(SubmissionFormComponent, {
      data:student,
      panelClass:'submit-assignment'
    });
  }
  HistoryAssignment(){}
  CloseMatdilog(){
    this._matDialog.closeAll();
  }
}

