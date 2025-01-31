import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateExam, Qbank } from '../exam.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CompetenecyLevel, Course, LevelQuestion, QbankType, QbankcmbCode, Subjects, Topic } from '../../common/commonModel';
import { ActivatedRoute } from '@angular/router';
import { helperService } from 'app/core/auth/helper';
import { QuestionListFilter, QuestionListModel, Tag } from '../../common/QuestionModel';
import { BehaviorSubject, Observable, Subject, catchError, finalize, of, takeUntil } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/collections';
import { ExamService } from '../exam.service';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { CommanService } from 'app/modules/common/comman.service';
import { ApiErrorHandlerService } from '../../common/api-error-handler.service';
import { QuestionSearchList } from '../../qbank/QuestionModel';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';
import { MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
// import { CKEditorModule } from 'ckeditor4-angular';
// import { CKEditorModule } from 'ng2-ckeditor';
// import { CKEDITOR_CONFIG } from 'app/modules/admin/common/';
import { environment } from 'environments/environment';

export const CKEDITOR_CONFIG = {
  allowedContent: true,
  extraPlugins: 'tableresize,uploadimage,elementspath',
  extraAllowedContent: '*{*}[*]',
  filebrowserBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html',
  filebrowserImageBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
  filebrowserUploadUrl: environment.apiURL + '/files/upload?',
  filebrowserImageUploadUrl: environment.apiURL + '/files/upload?',

};

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [CommonModule,MatStepperModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatToolbarModule,
    MatButtonModule,
    MatStepperModule,
    MatExpansionModule,
    MatBadgeModule,
    MatChipsModule,
    // CKEditorModule,
  ],
  templateUrl: './create-exam.component.html',
  styleUrl: './create-exam.component.scss'
})
export class CreateExamComponent implements OnInit {
  isFormSubmitted: boolean = false;
  CreateExam: FormGroup;
  CreateExamQbank: FormGroup;
  CreateListFilter: FormGroup;
  CreateExamSchedule: FormGroup;
  startTime: string;
  endTime: string;
  isLinear = true;
  date: string;
  qbanktype: Array<QbankType> = [];
  Qbank: Array<Qbank> = [];
  subjects: Array<Subjects> = [];
  CBME: Array<QbankcmbCode> = [];
  Courses: Array<Course> = [];
  competenecyLevel: Array<CompetenecyLevel> = []
  levelquestion: Array<LevelQuestion> = []
  topics: Array<Topic> = [];
  duration: string;
  TopicsList: any = [];
  isQbankformHaserror: boolean = false;
  IsSheduleFormHasError: boolean = false;
  CBMEcodeList: any = [];
  invalidTime: boolean = false;
  studentCourseList: any = [];
  secondfilter: FormGroup;
  Tags: Array<Tag> = [];
  IsselectedQuestion: boolean = false;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('myDialog1') myElementRef!: ElementRef;
  private _unsubscribeAll: any;
  QuestionForm: any;
  Question_List_status: any;
  dataSource: QuestionlistDataSource;
  status: number;
  TagID: any = 0;
  qbankTypes: any = [];
  LevelIDOfQuestion: number = 0;
  LevelID: number = 0;
  Subjects: any = [];
  QbankTypeList: any = [];
  questionDetails: any;
  selectedQuestionId: number;
  QuestionData: any = [];
  QuestionSelected: any = [];
  NoofSelectedQuestion: string;
  TotalSelectQuestion: any = 0;
  durationMinuts: any;
  ckeConfig: any;
  // public Editor = ClassicEditor;
  // ckeConfig: { allowedContent: boolean; forcePasteAsPlainText: boolean; extraPlugins: string; filebrowserBrowseUrl: string; filebrowserImageBrowseUrl: string; filebrowserUploadUrl: string; filebrowserImageUploadUrl: string; };
  userid: string;
  ReadOnlyStyleGuideNotes: boolean;
  constructor(
    private _formbuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private _commonService: CommanService,
    private _helpservice: helperService,
    private dialog: MatDialog,
    private _examService: ExamService,
    private _errorHendling: ApiErrorHandlerService
  ) {
    this.ckeConfig = CKEDITOR_CONFIG;

    this._unsubscribeAll = new Subject();

    this.CreateExamQbank = this._formbuilder.group({
      ExamName: ['', Validators.required],
      ExamDescription: ['', Validators.required],
      Qbank: ['', Validators.required],
      Studies: ['', Validators.required],
      Subject: ['', Validators.required],
      Topic: ['', Validators.required],
      CBMECode: ['', Validators.required],
      CompetencyLevel: ['', Validators.required],
      LevelofQuestions: ['', Validators.required],
      NumberofQuestions: ['', Validators.required]
    }),
      this.CreateListFilter = this._formbuilder.group({
        Level: [0],
        LevelOfquestion: [0],
        tags: [0]
      }),
      this.CreateExamSchedule = this._formbuilder.group({
        students: ['', Validators.required],
        examType: [1],
        ExamDate: ['', Validators.required],
        StartTime: ['', Validators.required],
        EndTime: ['', Validators.required],
        ShuffleAnswer: [false],
        ShuffleQuestion: [false],
        viewResult: [false],
        Percentage: [{ value: '', disabled: true }, [Validators.required, Validators.min(0), Validators.max(100)]],
        Evaluation: [false],
        Evaluationtime: [{ value: '', disabled: true }, Validators.required],
        AwardCertificate: [false],
        AwardGift: [false]

      }),
      this.ckeConfig = {
        allowedContent: false,
        forcePasteAsPlainText: true,
        extraPlugins: 'tableresize,uploadimage',
        filebrowserBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html',
        filebrowserImageBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
        filebrowserUploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files',
        filebrowserImageUploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images',
      };
  }
  ngOnInit(): void {
    this.status = 0;
    this._commonService.getQBankTypes('General').subscribe(res => {
      console.log(res, 'q bank')
      this.Qbank = res;
    }, (error) => {
      this._errorHendling.handleError(error);
    }
    )
    //Get Courses 
    // this._commonService.getCourses().subscribe(response => {
    //   this.Courses = response.data;
    // }, (error) => {
    //   this._errorHendling.handleError(error);
    // })

    this.competenecyLevel = this.activatedRoute.snapshot.data.competenecyLevel;//get capetencyLevel
    this.levelquestion = this.activatedRoute.snapshot.data.levelquestion; // get LevelofQuestion
    this.Tags = this.activatedRoute.snapshot.data.tags; // get tags 
    this.userid = this._helpservice.getUserDetail().Id; // get userId
    this.qbanktype = this.activatedRoute.snapshot.data.qbanktype;   //Get Qbanks 


    //to enable diable % Subscribe to changes in the 'viewResult' control
    this.CreateExamSchedule.get('viewResult')?.valueChanges.subscribe(value => {
      const percentageControl = this.CreateExamSchedule.get('Percentage');

      if (percentageControl) {
        if (value) {
          percentageControl.enable();
        } else {
          percentageControl.disable();
        }
      }
    });
    //to enable diable Evaluation Subscribe to changes in the 'viewResult' control
    this.CreateExamSchedule.get('Evaluation')?.valueChanges.subscribe(value => {
      const Evaluation = this.CreateExamSchedule.get('Evaluationtime');

      if (Evaluation) {
        if (value) {
          Evaluation.enable();
        } else {
          Evaluation.disable();
        }
      }
    });
  }

  getExamListing() {
    this.dataSource = new QuestionlistDataSource(this._commonService)
    this._commonService.question_list.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        let gridFilter: QuestionSearchList = {
          keyword: '',
          pageNumber: 1,
          pageSize: 100,
          orderBy: '',
          sortOrder: '',
          // status: -1,
          // tagIds: this.TagID > 0 ? [this.TagID] : [],
          // qBankTypeId: this.CreateExamQbank.get('Studies').value > 0 ? [this.CreateExamQbank.get('Studies').value] : [],
          qBankTypeId: 0,
          levelofQuestionId: this.LevelIDOfQuestion,
          competencyLevelId: this.LevelID,
          qBankCategory: '',
          // qBankCategoryId: this.CreateExamQbank.get('Qbank').value.length > 0 ? this.CreateExamQbank.get('Qbank').value : '',
          // subjectId: this.CreateExamQbank.get('Subject').value > 0 ? [this.CreateExamQbank.get('Subject').value] : [],
          subjectId: 0,
          // topicIds: this.CreateExamQbank.get('Topic').value.length > 0 ? this.CreateExamQbank.get('Topic').value : [],
          topicId: 0,
          // cmbeCodeIds: this.CreateExamQbank.get('CBMECode').value.length > 0 ? this.CreateExamQbank.get('CBMECode').value : [],
          cbmeCodeId: 0,
          tags: 0
        };
        this.dataSource.getQuestionList(gridFilter)
        this.NoofSelectedQuestion = this.CreateExamQbank.get('NumberofQuestions').value
      })
    this.isQbankformHaserror = true;
  }
  search() {
    this._commonService.question_list.next(this.Question_List_status)
  }
  //Get Question detail for listing 
  getquestiondetails(questionDetailID) {
    var self = this;
    var question = this.QuestionData.find(question => question.QuestionId == questionDetailID);
    if (!question) {
      this._commonService.getQuestionbyID(questionDetailID).subscribe((response: any) => {
        this.QuestionData.push({ QuestionId: response.questionDetailID, response: response })
        this.questionDetails = response;
        self.selectedQuestionId = questionDetailID;
      })
    }
    else {
      this.questionDetails = question.response;
      self.selectedQuestionId = questionDetailID;
    }
  }
  // Get Qbank Subject 
  getQbanksubject(QbankTypeID: number) {
    this._commonService.getSubjects(QbankTypeID,"General").subscribe((response: any) => {
      this.subjects = response;
      if (!this.subjects.find(s => s.subjectID == this.CreateExamQbank.get('Subject').value)) {
        this.CreateExamQbank.get('Subject').setValue('');
        this.topics = [];
        this.CreateExamQbank.get('Topic').setValue('');
        this.CreateExamQbank.get('CBMECode').setValue('');
        this.CBME = [];
        this.TopicsList = [];
        this.CBMEcodeList = [];
      }
    })
  }
  // get Topics here 
  selectSubject(subjectID: number, onload: boolean = false) {
    this._commonService.getTopics(subjectID,'General').subscribe(res => {
      this.topics = res;
      if (!this.topics.find(t => t.topicID == this.CreateExamQbank.get('Topic').value)) {
        this.CreateExamQbank.get('Topic').setValue('');
        this.CreateExamQbank.get('CBMECode').setValue('');
        this.CBME = [];
        this.TopicsList = [];
        this.CBMEcodeList = [];
      }
    })
  }
  //Get CBme here and push data in topic chip.
  OnclickTopic(topic: Topic, Cbme: any) {
    // debugger;
    var index = this.TopicsList.findIndex(i => i.ID == topic.topicID);
    if (index > -1) {
      this.TopicsList.splice(index, 1);
      this.removeCbmEOnRemovalOfTopic(topic.topicID);
    }
    else {
      this.TopicsList.push({ ID: topic.topicID, Name: topic.topicName });
      this._commonService.getCBMECode(topic.topicID,'General').subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          this.CBME.push(res[i]);
          if (Cbme) {
            if (Cbme.find(t => t == res[i])) {
              this.CBMEcodeList.push({ ID: res[i].cmbeid, TopicId: res[i].topicID, Name: res[i].title });
            }
          }
        }
      })
    }
  }
  //Remove Topic on Topic click
  removeTopic(index: number, value: any) {
    this.TopicsList.splice(index, 1);
    const topic = this.CreateExamQbank.get('Topic').value as string[];
    this.removeFirst(topic, value);
    this.removeCbmEOnRemovalOfTopic(value);
    this.CreateExamQbank.get('Topic').setValue(topic);
  }
  // Remove CBme array when Topic Clear 
  removeCbmEOnRemovalOfTopic(TopicId) {
    const cbmeTag = this.CreateExamQbank.get('CBMECode').value as [];
    for (var i = this.CBMEcodeList.length - 1; i >= 0; i--) {

      if (this.CBMEcodeList[i].TopicId == TopicId) {
        this.removeFirst(cbmeTag, this.CBMEcodeList[i].ID);
        this.CBMEcodeList.splice(i, 1);
      }
    }
    this.CreateExamQbank.get('CBMECode').setValue(cbmeTag);
    for (var i = this.CBME.length - 1; i >= 0; i--) {
      if (this.CBME[i].topicID == TopicId)
        this.CBME.splice(i, 1);
    }
  }
  // Push Cmbe detail on click cbme for chip 
  OnclickCmbeCode(CBME: QbankcmbCode) {
    var index = this.CBMEcodeList.findIndex(i => i.ID == CBME.cmbeid);
    if (index > -1) {
      this.CBMEcodeList.splice(index, 1)
    } else {
      this.CBMEcodeList.push({ ID: CBME.cmbeid, TopicId: CBME.topicID, Name: CBME.title, Description: CBME.description });
    }
  }
  //Remove Cbme Code 
  removeCBME(index: number, text: any) {
    this.CBMEcodeList.splice(index, 1);
    const CBMECode = this.CreateExamQbank.get('CBMECode').value as string[];
    this.removeFirst(CBMECode, text);
    this.CreateExamQbank.get('CBMECode').setValue(CBMECode);
  }
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  // Remove Course from List 
  OnclickCourse(StudentId: number, StudentCourse: string, noOfStudent) {
    var index = this.studentCourseList.findIndex(i => i.ID == StudentId);
    if (index > -1) {
      this.studentCourseList.splice(index, 1)
    } else {
      this.studentCourseList.push({ ID: StudentId, CourseYear: StudentCourse, noOfStudent: noOfStudent });
    }
  }

  removeCouse(index: number, text: any) {
    this.studentCourseList.splice(index, 1);
    const students = this.CreateExamSchedule.get('students').value as string[];
    this.removeFirst(students, text);
    this.CreateExamSchedule.get('students').setValue(students);
  }
  // Calclute Exam Duration 
  calculateDuration() {
    if (this.date && this.startTime && this.endTime) {
      const dateTimeStr = `${this.date}T${this.startTime}:00Z`;
      const start = new Date(dateTimeStr);
      const end = new Date(`${this.date}T${this.endTime}:00Z`);

      if (end < start) {
        this.endTime = '';
        this.duration = '';
        this._snackBar.open("End time cannot be earlier than start time", 'Close', {
          duration: 2000,
        });
      } else {
        const diffMs = end.getTime() - start.getTime();
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

        if (diffHrs === 0) {
          // If less than 1 hour, display minutes
          this.duration = `${diffMins} mins`;
          this.durationMinuts = diffMins;
        } else {
          // Otherwise, display hours and minutes
          this.duration = `${diffHrs}:${diffMins} hours`;
          this.durationMinuts = diffHrs * 60 + diffMins;
        }
      }
    }
  }

  // calculateDuration() {
  //   if (this.date && this.startTime && this.endTime) {
  //     const dateTimeStr = `${this.date}T${this.startTime}:00Z`;
  //     const start = new Date(dateTimeStr);
  //     const end = new Date(`${this.date}T${this.endTime}:00Z`);
  //     if (end < start) {
  //       this.endTime = '';
  //       this.duration = '';
  //       this._snackBar.open("End time cannot be earlier than start time", 'Close', {
  //         duration: 2000,
  //       });
  //     } else {
  //       const diffMs = end.getTime() - start.getTime();
  //       const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  //       const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
  //       this.duration = `${diffHrs}:${diffMins} hours`;
  //       this.durationMinuts = diffHrs * 60 + diffMins;
  //     }
  //   }
  // }
  // get current date and year for calender 
  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  // validate % field 
  validatePercentage(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseFloat(inputElement.value);
    if (isNaN(value) || value <= 0 || value > 100) {
      this.CreateExamSchedule.get('Percentage').setValue(''),
        this._snackBar.open(" Invalid percentage value. Please enter a value between 1 and 100. ", 'Close', {
          duration: 2000,
        });
    }
  }
  //dialogbox for listing 
  closedialog() {
    this.dialog.closeAll();
  }
  openDialogWithTemplateRef(templateRef: any, panelClass: any) {
    this.dialog.open(templateRef, {
      panelClass: panelClass
    });
  }
  isQuestionSelected(questionDetailID: any): boolean {
    return this.QuestionSelected.includes(questionDetailID);
  }
  //CheckBox Popup and Push QuestioId in Selected Question
  onChange(event: any, questionDetailID: any) {
    const index = this.QuestionSelected.findIndex(i => i === questionDetailID);

    if (index > -1) {
      this.QuestionSelected.splice(index, 1);
    } else if (this.QuestionSelected.length < this.NoofSelectedQuestion) {
      this.QuestionSelected.push(questionDetailID);
    } else {
      // User tried to select more checkboxes than allowed, show a popup and uncheck the checkbox
      setTimeout(() => {
        event.source.checked = false; // Unchecks the checkbox
      }, 0);
      this.openDialogWithTemplateRef(this.myElementRef, "popup-1");
      return false;
    }
    // Update TotalSelectQuestion to enable diable button
    this.TotalSelectQuestion = this.QuestionSelected.length;
  }
  goToFirStep() {
    this.stepper.selectedIndex = 0;
  }
  // Create Exam 
  Onsubmit() {
    // this.isFormSubmitted = true;
    if (this.CreateExamSchedule.invalid) {
      this.IsSheduleFormHasError = true;
    }
    else {
      var FormData: CreateExam = {
        name: this.CreateExamQbank.get('ExamName').value,
        description: this.CreateExamQbank.get('ExamDescription').value,
        qbankCategory: this.CreateExamQbank.get('Qbank').value,
        qbankTypeId: this.CreateExamQbank.get('Studies').value,
        subjectId: this.CreateExamQbank.get('Subject').value,
        topics: this.CreateExamQbank.get('Topic').value,
        cmbeCodes: this.CreateExamQbank.get('CBMECode').value,
        levelId: this.CreateExamQbank.get('CompetencyLevel').value,
        levelIdOfQuestion: this.CreateExamQbank.get('LevelofQuestions').value,
        noOfQuestions: this.CreateExamQbank.get('NumberofQuestions').value,
        courses: this.CreateExamSchedule.get('students').value,
        examType: this.CreateExamSchedule.get('examType').value,
        examStatus: 0,
        startOn: this.CreateExamSchedule.get('ExamDate').value,
        endOn: this.CreateExamSchedule.get('ExamDate').value,
        duration: this.durationMinuts,
        examQuestions: this.QuestionSelected,
        shuffleAnswers: this.CreateExamSchedule.get('ShuffleAnswer').value,
        shuffleQuestions: this.CreateExamSchedule.get('ShuffleQuestion').value,
        canUserViewResults: this.CreateExamSchedule.get('viewResult').value,
        // Percentage: this.schedule.get('Percentage').value,
        evaluationPeriodRequired: this.CreateExamSchedule.get('Evaluation').value,
        evaluationCompleteOn: this.CreateExamSchedule.get('Evaluationtime').value,
        certificateProvision: this.CreateExamSchedule.get('AwardCertificate').value,
        giftProvision: this.CreateExamSchedule.get('AwardGift').value,
      }

      this._examService.CreateExam(FormData).subscribe(response => {
        if (response) {
          this.isFormSubmitted = true;
        }
      }, (error) => {
        this._errorHendling.handleError(error)
      }
      )
    }
  }
  copyText(fieldName) {
    const copyText = (document.getElementById(fieldName)) as HTMLInputElement;
    copyText.disabled = false;
    copyText.select();
    document.execCommand('Copy');
    copyText.disabled = true;
  }
  SendMessage() {
    alert("Message sent")
  }
  ClearQbankForm() {
    this.CreateExamQbank.reset();
    this.CBMEcodeList = [];
    this.TopicsList = [];

  }
  clearsheduleForm() {
    this.CreateExamSchedule.reset();
    this.studentCourseList = [];
    this.duration = '';
    this.CreateExamSchedule.patchValue({
      examType: 2
    })
  }

  getNext(event: PageEvent) {
    this._commonService.question_list.next(this.Question_List_status);
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
  //Get Question here for Listing 
  getQuestionList(gridFilter: QuestionSearchList) {
    this._questionService.getQuestion(gridFilter).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    )
      .subscribe((res: any) => {
        this.QuestionList = res.data;
        this.paginationData = {
          count: res.Count,
          pageNumber: res.CurrentFilter?.PageNumber
        };
      }
      );

  }

}
