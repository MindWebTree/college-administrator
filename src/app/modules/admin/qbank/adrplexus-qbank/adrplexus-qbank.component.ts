import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { CompetenecyLevel, LevelQuestion, QBankFilter, QuestionListFilter, QuestionListModel, QuestionSearchList, Tag as TagModel } from '../QuestionModel';
import { BehaviorSubject, Observable, Subject, catchError, finalize, first, of, takeUntil } from 'rxjs';
import { helperService } from 'app/core/auth/helper';
import { CommanService } from 'app/modules/common/comman.service';
import { SitePreference } from 'app/core/auth/app.configs';
import { QuestionService } from '../question.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adrplexus-qbank',
  standalone: true,
  providers: [QuestionService],
  imports: [MatPaginatorModule,MatFormFieldModule,MatSelectModule,MatIconModule, CommonModule, MatExpansionModule, MatChipsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    HttpClientModule],
  templateUrl: './adrplexus-qbank.component.html',
  styleUrl: './adrplexus-qbank.component.scss'
})
export class AdrplexusQbankComponent implements OnInit {
  secondfilter: FormGroup;
  Tags: Array<TagModel> = [];
  private loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  QuestionList: Array<QuestionListModel> = []
  QuestionCount: number;
  public paginationData: any;
  private _unsubscribeAll: any;
  _sitePreference: any = SitePreference;
  QuestionForm: any;
  competenecyLevel: Array<CompetenecyLevel> = []
  levelquestion: Array<LevelQuestion> = []
  Question_List_status: any;
  dataSource: QuestionlistDataSource;
  status: number;
  TagID: number = 0;
  qbankTypes: any = [];
  LevelIDOfQuestion: number = 0;
  LevelID: number = 0;
  Subjects: any = [];
  QbankTypeList: any = [];
  QbankTypeId: number = 0;
  Subjectid: number = 0;
  TopicId: number = 0;
  CbmeId: number = 0;
  questionDetails:any;
  selectedQuestionId:number;
  QuestionData:any=[];
  userid:string;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _questionService: CommanService,
    private _helperService: helperService,
    private cdref: ChangeDetectorRef,
    private _questionfilter: QuestionService
  ) {
    this._unsubscribeAll = new Subject();
    this.secondfilter = this.fb.group({
      Level: [0],
      LevelOfquestion: [0],
      tags: [0]

    })
  }
  ngOnInit(): void {
    this.status = -1;
    this.dataSource = new QuestionlistDataSource(this._questionService)
    // this.competenecyLevel = this.activatedRoute.snapshot.data.competenecyLevel;
    // this.levelquestion = this.activatedRoute.snapshot.data.levelquestion;
    // this.Tags = this.activatedRoute.snapshot.data.tags;
    this._questionService.getLevel().subscribe(res=>{
      this.competenecyLevel =res
    });
    this._questionService.getLevelofQuestions().subscribe(res=>{
      this.levelquestion =res
    });
    this._questionService.geTags().subscribe(res=>{
      this.Tags =res
    });
    this._questionService.question_list.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        let gridFilter: QuestionSearchList = {
          keyword: '' ,
          pageNumber: this.paginator?.pageIndex + 1,
          pageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
          orderBy: '',
          sortOrder: '',
          qBankTypeId: 0,
          qBankCategory: "General",
          subjectId: this.Subjectid,
          topicId: [],
          cbmeCodeId: [  ],
          competencyLevelId: this.LevelID,
          levelofQuestionId: this.LevelIDOfQuestion,
          tags: this.TagID
        };
        this.dataSource.getQuestionList(gridFilter, this.status)
      })
      
    // this._questionfilter.QbanksfilterValues$.subscribe(res=>{console.log(res,"ssa")})
    this._questionfilter.QbanksfilterValues$.pipe().subscribe((values: any) => {
      console.log(this._unsubscribeAll,"_unsubscribeAll")
      console.log(values,"valuesq")
      this.QbankTypeId = values.QbankType;
      this.Subjectid = values.Subject;
      this.TopicId = values.Topic;
      this.CbmeId = values.CBMECode;
      this._questionService.question_list.next(this.Question_List_status);
      this.cdref.detectChanges();
    })
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
}
  loadPage() {
    this._questionService.question_list.next(this.Question_List_status);
  }
  getNext(event: PageEvent) {
    this._questionService.question_list.next(this.Question_List_status);

  }
  search() {
    this._questionService.question_list.next(this.Question_List_status);
  }
  getquestiondetails(questionDetailID) {
  var self=this;
    var question=this.QuestionData.find(question=>question.QuestionId==questionDetailID);
    if(!question){
     this._questionService.getQuestionbyID(questionDetailID).subscribe((response: any) => {
     this.QuestionData.push({QuestionId:response.questionDetailID,response:response})
     this.questionDetails=response;
     self.selectedQuestionId=questionDetailID;
  
    })
  }
  else{
  this.questionDetails=question.response;
    self.selectedQuestionId=questionDetailID;
  }
}
}


export class QuestionlistDataSource extends DataSource<QuestionListModel>
{

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  QuestionList: Array<QuestionListModel> = []
  QuestionCount: number;

  constructor(private _questionService: CommanService) {
    super();
  }

  disconnect(): void {
  }

  connect(): Observable<any[]> {
    return this._questionService.question_list;
  }

  getQuestionList(gridFilter: QuestionSearchList, status) {
    var self = this;
    this._questionService.getQuestion(gridFilter).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    )

      .subscribe((res: any) => {
        this.QuestionList = res.data;
        this.QuestionCount = res.Count;
        self.paginationData = {
          count: res.totalCount,
          pageNumber: res.currentPage
        };
      });

  }

}
