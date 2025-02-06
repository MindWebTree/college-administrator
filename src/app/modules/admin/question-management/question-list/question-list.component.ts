import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
// import { SitePreference } from 'app/app.config';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatBadgeModule } from '@angular/material/badge';
import { QuestionManagementService } from '../question-management.service';
import { CreateQuestion } from '../question-management.model';
import { MatMenuModule } from '@angular/material/menu';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SitePreference } from 'app/core/auth/app.configs';
import { QuestionListFilter } from '../../common/QuestionModel';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [MatPaginatorModule, MatMenuModule, MatExpansionModule, MatBadgeModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule, MatButtonModule, OverlayModule, FormsModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  _sitePreference: any = SitePreference;
  QuestionForm: any;
  Question_List_status: any;
  dataSource: QuestionlistDataSource;
  status: number;
  TagID: number = 0;
  qbankTypes: any = [];
  LevelIDOfQuestion: number = 0;
  LevelID: number = 0;
  Subjects: any = [];
  QbankTypeList: any = [];
  isPanelExpanded: boolean[] = [];
  questionDetails: any;
  QuestionData: any = [];
  selectedQuestionId: number;
  QbankTypeId: number = 0;
  Subjectid: number = 0;
  userid: string;
  searchInput: FormControl;
  // currentSearchText: string = ''; // added by harsh to track current search

  constructor(
    public _matDialog: MatDialog,
    private _router: Router,
    private _questionManagementService: QuestionManagementService

  ) {
    this.searchInput = new FormControl('');
  }
  ngOnInit(): void {
    this.status = -1;
    this.dataSource = new QuestionlistDataSource(this._questionManagementService)

    this._questionManagementService.question_list.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {
        this.Question_List_status = search;
        let gridFilter: QuestionListFilter = {
          keyword: typeof search === "string" ? search : '',
          pageNumber: this.paginator?.pageIndex + 1,
          pageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
          orderBy: '',
          sortOrder: '',
          tags: 0,
          qBankTypeId: this.QbankTypeId,
          // qBankCategory: 'Owned',
          qBankCategory: 'Owned', 
          subjectId: this.Subjectid,
          topicId: [],
          cbmeCodeId: [],
          competencyLevelId: 0,
          levelofQuestionId: 0
        };
        this.dataSource.getQuestionList(gridFilter, this.status)
      });
    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        // this.currentSearchText = searchText;
        this._questionManagementService.question_list.next(searchText);
      });
      this._questionManagementService.QbanksfilterValues$.pipe().subscribe((values: any) => {
        this.QbankTypeId = values.QbankType?values.QbankType:0;
        this.Subjectid = values.Subject?values.Subject:0;
        this._questionManagementService.question_list.next(true);
      })
  }
  loadPage() {
    this._questionManagementService.question_list.next(this.Question_List_status);
  }
  getNext(event: PageEvent) {
    this._questionManagementService.question_list.next(this.Question_List_status);

  }
  onNavigate(questionDetailId: any) {

    this._router.navigate(['/qbank/Edit/' + questionDetailId]);
  }
  getquestiondetails(questionDetailID) {

    var self = this;
    // var question = this.QuestionData.find(question => question.QuestionId == questionDetailID);
    const question = this.dataSource.QuestionList.find(q => q.questionDetailId === questionDetailID);
    if (question) {
      this.questionDetails = question;
      this.selectedQuestionId = questionDetailID;
      // this._questionManagementService.getQuestionbyID(questionDetailID).subscribe((response: any) => {
      //   console.log(response, "response")
      //   this.QuestionData.push({ QuestionId: response.questionDetailID, response: response })
      //   this.questionDetails = response;
      //   self.selectedQuestionId = questionDetailID;

      // })
    }
    // else {
    //   this.questionDetails = question.response;
    //   self.selectedQuestionId = questionDetailID;
    // }
  }

  deletequestion(questionDetailID) {

    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false

    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._questionManagementService.deleteQuestion(questionDetailID);

      }
      this.confirmDialogRef = null;
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.searchInput.reset();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}


export class QuestionlistDataSource extends DataSource<CreateQuestion> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  QuestionList: Array<CreateQuestion> = []
  QuestionCount: number;

  constructor(private _questionManagementService: QuestionManagementService) {
    super();
  }

  disconnect(): void {
  }

  connect(): Observable<any[]> {
    return this._questionManagementService.question_list;
  }

  getQuestionList(gridFilter: QuestionListFilter, status) {
    this._questionManagementService.qbankSearch(gridFilter).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    )
      .subscribe((res: any) => {
        console.log(res, "res")
        this.QuestionList = res.data;
        console.log(this.QuestionList, " this.QuestionList")
        this.QuestionCount = res.Count;
        this.paginationData = {
          count: res.totalCount || 0,
          pageNumber: res.currentPage || 1,
          pageSize: res.pageSize || 10
        };
      });

  }

}

