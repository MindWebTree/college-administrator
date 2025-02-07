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
import { CommonModule, Location } from '@angular/common';
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
import { CKEDITOR_CONFIG } from '../../common/comman-ckeditor-config';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatNativeDateModule,
    MatDatepickerModule,
    MatDatepickerModule ,
    CKEditorModule,
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
  qbanktype: any = [];
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
  QuestionSelected: Array<number>=[];
  NoofSelectedQuestion: number;

  durationMinuts: any;
  QbankCategory: any;
  ckeConfig: any;
  qBankCategorySelected:any;
  examDetails:any =[];
  // public Editor = ClassicEditor;
  // ckeConfig: { allowedContent: boolean; forcePasteAsPlainText: boolean; extraPlugins: string; filebrowserBrowseUrl: string; filebrowserImageBrowseUrl: string; filebrowserUploadUrl: string; filebrowserImageUploadUrl: string; };
  userid: string;
  minDate: Date = new Date();
  minTime: number =0;
  ReadOnlyStyleGuideNotes: boolean;
  createdExamDetails :any
  examId:number=0;
  editExamDetails : any;

  constructor(
    private _formbuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private _commonService: CommanService,
    private _helpservice: helperService,
    private dialog: MatDialog,
    private _location: Location,
    private _examService: ExamService,
    private _errorHendling: ApiErrorHandlerService
  ) {
    
    this.ckeConfig = CKEDITOR_CONFIG;

    this._unsubscribeAll = new Subject();

    this.CreateExamQbank = this._formbuilder.group({
      ExamName: ['', Validators.required],
      ExamDescription: ['', Validators.required],
      QbankCategory: ['', Validators.required],
      Studies: ['', Validators.required],
      Subject: ['', Validators.required],
      Topic: ['', Validators.required],
      CBMECode: ['', Validators.required],
      CompetencyLevel: [''],
      LevelofQuestions: [''],
      NumberofQuestions: ['', Validators.required]
    }),
      this.CreateListFilter = this._formbuilder.group({
        // Level: [0],
        // LevelOfquestion: [0],
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
        Percentage: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0), Validators.max(100)]],
        // Evaluation: [false],
        // Evaluationtime: [{ value: '', disabled: true }, Validators.required],
        // AwardCertificate: [false],
        // AwardGift: [false]

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
      this._commonService.getstudentNavigationList().subscribe(res=>{
        this.Courses = res;
      })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res=>{
      this.examId = res.id;
      if(this.examId){
      this._examService.getExamByid(this.examId).subscribe(res=>{
        this.editExamDetails = res;
        this.qBankCategorySelected = this.editExamDetails.qbankCategory;
       
        this.getQbank(this.qBankCategorySelected,true);
        this.getQbanksubject(this.editExamDetails.qBankTypeId);
        const date = this.editExamDetails.examDate.split('T')[0];
        const startTime = this.editExamDetails.examDate.split('T')[1];
        const endTime = this.editExamDetails.examEndDate?.split('T')[1];
        this.CreateExamSchedule.get('ExamDate').patchValue(date);
        this.CreateExamSchedule.get('StartTime').patchValue(startTime);
        this.CreateExamSchedule.get('EndTime').patchValue(endTime);
        console.log(this.CreateExamSchedule.get('ExamDate').value)
        this._commonService.getTopics(this.editExamDetails.subjectId, this.qBankCategorySelected).subscribe(res => {
          if (res) {
            this.topics = res;
            this.selectSubject(this.editExamDetails.subjectId,true);
            this.editExamDetails?.topics.forEach((topicId) => {
              this.OnclickTopic(topicId, "");
            });
            this.editExamDetails?.cbmeCodeId.forEach((cbmeCodeId) => {
              this.OnclickCmbeCode(cbmeCodeId);
            });
            let courseSelected: any = [];
            this.editExamDetails?.courses.forEach((course) => {
              courseSelected.push(course.courseYearId);
              const selectedCourseCount = this.Courses.find(c => c.id == course.courseYearId)?.count
              this.studentCourseList.push({ courseYearId: course.courseYearId, CourseYear: course.courseYear, noOfStudent: selectedCourseCount, courseId: course.courseId });

            });

           
            this.QuestionSelected = this.editExamDetails.questions;

            console.log(this.CreateExamQbank.get('Topic').value, "value topic11")
            this.CreateExamQbank.patchValue({
              ExamName: this.editExamDetails.name,
              ExamDescription: this.editExamDetails.description,
              QbankCategory: this.editExamDetails.qbankCategoryId,
              Studies: this.editExamDetails.qBankTypeId,
              Subject: this.editExamDetails.subjectId,
              Topic: this.editExamDetails.topics.map(t=> t),
              CBMECode: this.editExamDetails.cbmeCodeId,
              CompetencyLevel: this.editExamDetails.competencyLevelId,
              LevelofQuestions: this.editExamDetails.levelOfQuestionId,
              NumberofQuestions: this.editExamDetails.noOfQuestions
            });
            
            this.CreateListFilter.patchValue({
              // tags: this.editExamDetails.tags
            });
              this.CreateExamSchedule.patchValue({
                students: courseSelected,
                examType: this.editExamDetails.examMode,
                ShuffleAnswer: this.editExamDetails.shuffleAnswer,
                ShuffleQuestion: this.editExamDetails.shuffleQuestion,
                viewResult: this.editExamDetails.canViewResult,
                Percentage: this.editExamDetails.percentagePassMarks
              })

          }

        })
        
      })
    }
    })
    this.minTime = parseInt(this.minDate.toTimeString().split(' ')[0]);
    this.status = 0;
    this._commonService.getQBankCategory().subscribe(res => {
      this.QbankCategory = res;

    }, (error) => {
      this._errorHendling.handleError(error);
    }
    )
    this._commonService.geTags().subscribe(res => {
      this.Tags = res;

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

    // this.competenecyLevel = this.activatedRoute.snapshot.data.competenecyLevel;//get capetencyLevel
    // this.levelquestion = this.activatedRoute.snapshot.data.levelquestion; // get LevelofQuestion
    // this.Tags = this.activatedRoute.snapshot.data.tags; // get tags 
    // this.userid = this._helpservice.getUserDetail().Id; // get userId
    // this.qbanktype = this.activatedRoute.snapshot.data.qbanktype;   //Get Qbanks 


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
      this._commonService.getLevel().subscribe(res=>{
        this.competenecyLevel = res;
      })
      this._commonService.getLevelofQuestions().subscribe(res=>{
        this.levelquestion = res;
      })
    
  }

  getExamListing() {
  
    this.examDetails = this.CreateExamQbank.value;
    if(this.CreateExamQbank.invalid){
      this.isQbankformHaserror = true;
    }else{
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
            qBankTypeId: this.CreateExamQbank.get('Studies').value,
            levelofQuestionId: this.CreateExamQbank.get('LevelofQuestions').value,
            competencyLevelId: this.CreateExamQbank.get('CompetencyLevel').value,
            qBankCategory: this.qBankCategorySelected,
            // qBankCategoryId: this.CreateExamQbank.get('Qbank').value.length > 0 ? this.CreateExamQbank.get('Qbank').value : '',
            // subjectId: this.CreateExamQbank.get('Subject').value > 0 ? [this.CreateExamQbank.get('Subject').value] : [],
            subjectId: this.CreateExamQbank.get('Subject').value > 0 ? this.CreateExamQbank.get('Subject').value : 0,
            // topicIds: this.CreateExamQbank.get('Topic').value.length > 0 ? this.CreateExamQbank.get('Topic').value : [],
            topicId: this.CreateExamQbank.get('Topic').value.length > 0 ? this.CreateExamQbank.get('Topic').value : [],
            // cmbeCodeIds: this.CreateExamQbank.get('CBMECode').value.length > 0 ? this.CreateExamQbank.get('CBMECode').value : [],
            cbmeCodeId: this.CreateExamQbank.get('CBMECode').value.length > 0 ? this.CreateExamQbank.get('CBMECode').value : [],
            tags: this.CreateListFilter.get('tags').value > 0 ? this.CreateListFilter.get('tags').value :0
          };
            this.dataSource.getQuestionList(gridFilter, this.QuestionSelected)
          this.NoofSelectedQuestion = this.CreateExamQbank.get('NumberofQuestions').value
        })
    }
    
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
  // Get Qbank
  getQbank(CategoryName,isInit=false){
    
    this._commonService.getQBankTypes(CategoryName).subscribe((response: any) => {
      this.qBankCategorySelected =  CategoryName
      this.qbanktype = response;
      if (!this.qbanktype.find(s => s.id == this.CreateExamQbank.get('Studies').value)) {
        this.CreateExamQbank.get('Studies').setValue('');
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
  // Get Qbank Subject 
  getQbanksubject(QbankTypeID: number) {
    this._commonService.getSubjects(QbankTypeID,this.qBankCategorySelected).subscribe((response: any) => {
      this.subjects = response;
      if (!this.subjects.find(s => s.id == this.CreateExamQbank.get('Subject').value)) {
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
  selectSubject(subjectID: number, ngonit=false) {
    this._commonService.getTopics(subjectID,this.qBankCategorySelected).subscribe(res => {
      this.topics = res;
      if(!ngonit){
      if (!this.topics.find(t => t.id == this.CreateExamQbank.get('Topic').value)) {
        this.CreateExamQbank.get('Topic').setValue('');
        this.CreateExamQbank.get('CBMECode').setValue('');
        this.CBME = [];
        this.TopicsList = [];
        this.CBMEcodeList = [];
      }
    }
    })
  }
  //Get CBme here and push data in topic chip.
  OnclickTopic(topic, Cbme: any) {
    const topicTitle = this.topics.find(t => t.id === topic)?.title;
    var index = this.TopicsList.findIndex(i => i.ID == topic);
    if (index > -1) {
      this.TopicsList.splice(index, 1);
      this.removeCbmEOnRemovalOfTopic(topic);
    }
    else {
      this.TopicsList.push({ ID: topic, Name: topicTitle });
      this._commonService.getCBMECode(topic,this.qBankCategorySelected).subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          this.CBME.push(res[i]);
          if (Cbme) {
            if (Cbme.find(t => t == res[i])) {
              this.CBMEcodeList.push({ ID: res[i].id, TopicId: res[i].topicId, Name: res[i].title });
            }
          }
        }
      })
    }
  }
  getTopicName(ID){
    return this.topics.find(t => t.id === ID)?.title;
  }
  //Remove Topic on Topic click
  removeTopic(index: number, value: any) {
    this.TopicsList.splice(index, 1);
    this.CBMEcodeList = [];    
    this.CreateExamQbank.get('CBMECode').setValue('');
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
      if (this.CBME[i].topicId == TopicId)
        this.CBME.splice(i, 1);
    }
  }
  // Push Cmbe detail on click cbme for chip 
  OnclickCmbeCode(CBME) {

    const selectedCBMECode = this.CBME.find(c=> c.id == CBME)?.code;
    const selectedTopicId = this.CBME.find(c=> c.id == CBME)?.topicId;
    const selectedtitle = this.CBME.find(c=> c.id == CBME)?.title;
    const selecteddescription = this.CBME.find(c=> c.id == CBME)?.description;

    var index = this.CBMEcodeList.findIndex(i => i.ID == CBME);
    if (index > -1) {
      this.CBMEcodeList.splice(index, 1)
    } else {
      this.CBMEcodeList.push({ ID: CBME, Code: selectedCBMECode, TopicId: selectedTopicId, Name: selectedtitle, Description: selecteddescription });
    }
  }
  getCBMETitle(ID){
    return this.CBME.find(c=> c.id == ID)?.title;
  }
  getCBMEDescription(ID){
    return this.CBME.find(c=> c.id == ID)?.description;
  }
  getCBMECode(ID){
    return this.CBME.find(c=> c.id == ID)?.code;
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
  OnclickCourse(course) {
    var index = this.studentCourseList.findIndex(i => i.courseYearId == course.id);
    if (index > -1) {
      this.studentCourseList.splice(index, 1)
    } else {
      this.studentCourseList.push({ courseYearId: course.id, CourseYear: course.name, noOfStudent: course.count, courseId : course.courseId });
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
    if (this.CreateExamSchedule.valid) {
      const formData = this.CreateExamSchedule.value;
      // Get the date from ExamDate
      const examDate = new Date(formData.ExamDate);
      
      // Create the start date-time by combining date and start time
      const [startHours, startMinutes] = formData.StartTime.split(':');
      const examStartDate = new Date(examDate);
      examStartDate.setHours(parseInt(startHours), parseInt(startMinutes), 0);
      
      // Create the end date-time by combining date and end time
      const [endHours, endMinutes] = formData.EndTime.split(':');
      const examEndDate = new Date(examDate);
      examEndDate.setHours(parseInt(endHours), parseInt(endMinutes), 0);
      
      
    } else {
      Object.keys(this.CreateExamSchedule.controls).forEach(key => {
        const control = this.CreateExamSchedule.get(key);
        control?.markAsTouched();
      });
    }
    // if (this.date && this.startTime && this.endTime) {
    //   const dateTimeStr = `${this.date}T${this.startTime}:00Z`;
    //   const start = new Date(dateTimeStr);
    //   const end = new Date(`${this.date}T${this.endTime}:00Z`);

    //   if (end < start) {
    //     this.endTime = '';
    //     this.duration = '';
    //     this._snackBar.open("End time cannot be earlier than start time", 'Close', {
    //       duration: 2000,
    //     });
    //   } else {
    //     const diffMs = end.getTime() - start.getTime();
    //     const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    //     const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

    //     if (diffHrs === 0) {
    //       // If less than 1 hour, display minutes
    //       this.duration = `${diffMins} mins`;
    //       this.durationMinuts = diffMins;
    //     } else {
    //       // Otherwise, display hours and minutes
    //       this.duration = `${diffHrs}:${diffMins} hours`;
    //       this.durationMinuts = diffHrs * 60 + diffMins;
    //     }
    //   }
    // }
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
    } else if (this.QuestionSelected.length < this.NoofSelectedQuestion   ) {
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

  }
  goToFirStep() {
    this.stepper.selectedIndex = 0;
  }
  // Create Exam 
  Onsubmit() {
    if(this.CreateExamSchedule.get('examType')?.value == 0){
      this.CreateExamSchedule.get('EndTime')?.clearValidators();
      this.CreateExamSchedule.get('EndTime')?.updateValueAndValidity();
      // this.CreateExamSchedule.get('EndTime').patchValue('00:00');
      console.log(this.CreateExamSchedule.get('EndTime'),"asdfsdf")
    }
    // this.isFormSubmitted = true;
    console.log(this.examId,"this.examId")
    if (this.CreateExamSchedule.invalid) {
      this.IsSheduleFormHasError = true;
    }

    else if(this.examId == undefined){
      

    const selectedDate: Date = this.CreateExamSchedule.get('ExamDate')?.value;
    const startTime: string = this.CreateExamSchedule.get('StartTime')?.value;
    const endTime: string = this.CreateExamSchedule.get('EndTime')?.value;

    // Convert date and time to UTC format (yyyy-MM-ddTHH:mm:ss.SSZ)
    if(this.CreateExamSchedule.get('examType')?.value == 0){
    var formattedExamStartDate  = this.combineDateTime(selectedDate, startTime);
    }else{
      var formattedExamStartDate  = this.combineDateTime(selectedDate, startTime);
      var formattedExamEndDate  = this.combineDateTime(selectedDate, endTime);

    }
    
      var FormData: CreateExam = {
        name: this.CreateExamQbank.get('ExamName').value,
        description: this.CreateExamQbank.get('ExamDescription').value,
        // qbankCategory: this.CreateExamQbank.get('Qbank').value,
        // qbankTypeId: this.CreateExamQbank.get('Studies').value,
        subjectId: this.CreateExamQbank.get('Subject').value,
        topics: this.CreateExamQbank.get('Topic').value,
        // cmbeCodes: this.CreateExamQbank.get('CBMECode').value,
        // levelId: this.CreateExamQbank.get('CompetencyLevel').value,
        // levelIdOfQuestion: this.CreateExamQbank.get('LevelofQuestions').value,
        noOfQuestions: this.CreateExamQbank.get('NumberofQuestions').value,
        courses: this.studentCourseList?.length > 0 ? this.studentCourseList : [],
        // examType: this.CreateExamSchedule.get('examType').value,
        examStatus: 0,
        id: 0,
        mcqCode: '',
        cbmeCodeId: this.CreateExamQbank.get('CBMECode').value,
        qBankTypeId: this.CreateExamQbank.get('Studies').value,
        competencyLevelId: this.CreateExamQbank.get('CompetencyLevel').value,
        levelOfQuestionId: this.CreateExamQbank.get('LevelofQuestions').value,
        examDuration: 0,
        examMode: this.CreateExamSchedule.get('examType').value,
        tags: [this.CreateListFilter.get('tags').value],
        configuration: '',
        questions: this.QuestionSelected,
        examDate: formattedExamStartDate || null,
        examEndDate: formattedExamEndDate || null,
        qbankCategoryId: this.CreateExamQbank.get('QbankCategory').value,
        shuffleAnswer: this.CreateExamSchedule.get('ShuffleAnswer').value,
        shuffleQuestion: this.CreateExamSchedule.get('ShuffleQuestion').value,
        canViewResult: this.CreateExamSchedule.get('viewResult').value,
        percentagePassMarks: this.CreateExamSchedule.get('Percentage').value,
        evaluationCompleteOn: null,
        noOfStudents: this.CreateExamQbank.get('NumberofQuestions').value,
        numberOfAttendees: 0,
        averageDuration: 0
      }

      this._examService.CreateExam(FormData).subscribe(response => {
        if (response) {
          this.isFormSubmitted = true;
          this._examService.getExamByid(response.id).subscribe(res=>{
            this.createdExamDetails = res;
          })
        }
      }, (error) => {
        this._errorHendling.handleError(error)
      }
      )
    }
    else{
      const selectedDate: Date = this.CreateExamSchedule.get('ExamDate')?.value;
      const startTime: string = this.CreateExamSchedule.get('StartTime')?.value;
      const endTime: string = this.CreateExamSchedule.get('EndTime')?.value;
  
      // Convert date and time to UTC format (yyyy-MM-ddTHH:mm:ss.SSZ)
      if(this.CreateExamSchedule.get('examType')?.value == 0){
        var formattedExamStartDate  = this.combineDateTime(selectedDate, startTime);
        }else{
          var formattedExamStartDate  = this.combineDateTime(selectedDate, startTime);
          var formattedExamEndDate  = this.combineDateTime(selectedDate, endTime);
    
        }
  
        var FormData: CreateExam = {
          name: this.CreateExamQbank.get('ExamName').value,
          description: this.CreateExamQbank.get('ExamDescription').value,
          // qbankCategory: this.CreateExamQbank.get('Qbank').value,
          // qbankTypeId: this.CreateExamQbank.get('Studies').value,
          subjectId: this.CreateExamQbank.get('Subject').value,
          topics: this.CreateExamQbank.get('Topic').value,
          // cmbeCodes: this.CreateExamQbank.get('CBMECode').value,
          // levelId: this.CreateExamQbank.get('CompetencyLevel').value,
          // levelIdOfQuestion: this.CreateExamQbank.get('LevelofQuestions').value,
          noOfQuestions: this.CreateExamQbank.get('NumberofQuestions').value,
          courses: this.studentCourseList?.length > 0 ? this.studentCourseList : [],
          // examType: this.CreateExamSchedule.get('examType').value,
          examStatus: 0,
          id: this.examId,
          mcqCode: '',
          cbmeCodeId: this.CreateExamQbank.get('CBMECode').value,
          qBankTypeId: this.CreateExamQbank.get('Studies').value,
          competencyLevelId: this.CreateExamQbank.get('CompetencyLevel').value,
          levelOfQuestionId: this.CreateExamQbank.get('LevelofQuestions').value,
          examDuration: 0,
          examMode: this.CreateExamSchedule.get('examType').value,
          tags: [this.CreateListFilter.get('tags').value],
          configuration: '',
          questions: this.QuestionSelected,
          examDate: formattedExamStartDate,
          examEndDate: formattedExamEndDate,
          qbankCategoryId: this.CreateExamQbank.get('QbankCategory').value,
          shuffleAnswer: this.CreateExamSchedule.get('ShuffleAnswer').value,
          shuffleQuestion: this.CreateExamSchedule.get('ShuffleQuestion').value,
          canViewResult: this.CreateExamSchedule.get('viewResult').value,
          percentagePassMarks: this.CreateExamSchedule.get('Percentage').value,
          evaluationCompleteOn: null,
          noOfStudents: this.CreateExamQbank.get('NumberofQuestions').value,
          numberOfAttendees: 0,
          averageDuration: 0
        }
  
        this._examService.UpdateExam(FormData).subscribe(response => {
          if (response) {
            // this.isFormSubmitted = true;
            this._examService.getExamByid(response.id).subscribe(res=>{
              this.createdExamDetails = res;
              this._location.back();
            })
          }
        }, (error) => {
          this._errorHendling.handleError(error)
        }
        )
    }
  }
  combineDateTime(date: Date, time?: string): string {
    const [hours, minutes] = time?.split(':')?.map(Number);
    const formattedDate = new Date(date);

    formattedDate.setHours(hours, minutes, 0, 0); // Set hours & minutes

    // Format manually to prevent automatic UTC conversion
    const year = formattedDate.getFullYear();
    const month = ('0' + (formattedDate.getMonth() + 1)).slice(-2); // Ensure 2-digit month
    const day = ('0' + formattedDate.getDate()).slice(-2);
    const hour = ('0' + formattedDate.getHours()).slice(-2);
    const minute = ('0' + formattedDate.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`; // Preserve original time
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
  clearAllSecondStep(){
  
    this.QuestionSelected = [];
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
  getQuestionList(gridFilter: QuestionSearchList,QuestionSelected: Array<number>) {
    this._questionService.getQuestion(gridFilter).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false)
      })
    )
      .subscribe((res: any) => {
        this.QuestionList = res?.data;
      //   this.TotalSelectQuestion = 0;
      // this.QuestionSelected = [];
      const excludedQuestionId = [];
      QuestionSelected.forEach(id=>{
        if (!this.QuestionList.some(q => q.questionDetailId == id)) {
          excludedQuestionId.push(id);
        }
      });
    
      QuestionSelected.splice(0, QuestionSelected.length, ...QuestionSelected.filter(id => !excludedQuestionId.includes(id)));

  
    
        this.paginationData = {
          count: res?.Count,
          pageNumber: res?.CurrentFilter?.PageNumber
        };
      }
      );
     
  }

}
