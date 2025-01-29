import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExamService } from '../exam.service';
import { BehaviorSubject, catchError, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { ExamList } from '../exam.model';
import { DataSource } from '@angular/cdk/collections';
import { CommanService } from 'app/modules/common/comman.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SitePreference } from 'app/core/auth/app.configs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-waiting-for-approval',
  standalone: true,
  providers: [ExamService],
  imports: [MatIconModule,MatPaginatorModule,CommonModule],
  templateUrl: './waiting-for-approval.component.html',
  styleUrl: './waiting-for-approval.component.scss'
})
export class WaitingForApprovalComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: ExamlistDataSource;
  status: number;
  _sitePreference: any = SitePreference;
  private _unsubscribeAll: any;

  constructor(
    private _examService: ExamService
  ){
    this._unsubscribeAll = new Subject();
  }
  loadPage() {
    this._examService.onExamListChanged.next(true);
  }
  getNext(event: PageEvent) {
    this._examService.onExamListChanged.next(true);

  }
  
  ngOnInit(): void {
    this.dataSource = new ExamlistDataSource(this._examService)
    this._examService.onExamListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(res=>{
      let gridFilter: ExamList = {
        keyword: '',
        pageNumber: this.paginator?.pageIndex + 1,
        pageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
        orderBy: '',
        sortOrder: '',
        examStatus: 0,
        courseYearId: 0
      };
      this.dataSource.getExamList(gridFilter, this.status)
    })
  }
}
export class ExamlistDataSource extends DataSource<any>
{

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  ExamList: Array<any> = []
  ExamCount: number;

  constructor(private _examService: ExamService) {
    super();
  }

  disconnect(): void {
  }

  connect(): Observable<any[]> {
    return this._examService.onExamListChanged;
  }

  getExamList(gridFilter: ExamList, status) {
    var self = this;
    this._examService.getExamList(gridFilter).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    )

      .subscribe((res: any) => {
        this.ExamList = res.data;
        this.ExamCount = res.Count;
        self.paginationData = {
          count: res.totalCount,
          pageNumber: res.currentPage
        };
      });

  }

}