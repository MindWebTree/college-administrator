import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QbankSubject } from '../QuestionModel';
import { QuestionService } from '../question.service';
import { DataGuardService } from 'app/core/auth/data.guard';
import { ApiErrorHandlerService } from '../../common/api-error-handler.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatChipsModule, MatProgressBarModule, MatIconModule],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss'
})
export class ExamListComponent implements OnInit {
  noOfExamCompleted: number = 0;
  subjectId: any;
  QbankExamData: any;
  filteredExamData: any[] = [];  // to store filtered data
  subjectDetail: QbankSubject[] = [];
  examStatus: number = 0;
  dataLoaded: boolean = false;
  noOfexams: number = 0;

  constructor(
    private _qbankservice: QuestionService,
    private activeRoute: ActivatedRoute,
    private _router: Router,
    private _datagurd: DataGuardService,
    private _errorHandling: ApiErrorHandlerService
  ) {}

  ngOnInit(): void {

    this.activeRoute.params.subscribe(paramsId => {
      if (paramsId.subjectId) {
        this.subjectId = Number(paramsId.subjectId);
      } else {
        this.subjectId = 0;
      }
    });

    // this._qbankservice.getQbanksubjectsbyCourseId().subscribe((res: QbankSubject[]) => {
    //   this.subjectDetail = res;
    //   if (this.subjectId) {
    //     this.getsubjectAndQbank(this.subjectId);
    //   }
    // }, (error) => {
    //   this._errorHandling.handleError(error);
    // });
    this.getExamGrid(3);
    this.examStatus = 3
      
  }
  getExamGrid(examStatus:number){
    let request = {
      keyword: '',
      pageNumber: 0,
      pageSize: 0,
      orderBy: '',
      sortOrder: '',
      examStatus: examStatus ? examStatus : 0,
      courseYearId: null
    }
    this._qbankservice.getExamList(request).subscribe((res: any) => {
      this.QbankExamData = res.data;
      this.filteredExamData = res.data;  // Initialize with all data
      this.dataLoaded=true;
    }, (error) => {
      this._errorHandling.handleError(error);
    });
  }

  
  NavigatetoExam(exam) {
    if (exam.examStatus == 3 ) {
      this._router.navigate(['/qbank/game-analytics/' + exam.guid]);
    } else {
      this._router.navigate(['/qbank/exam-details/' + exam.guid]);
    }
  }
  FilterbyExamStatus(ExamStatus: number) {
    this.getExamGrid(ExamStatus);
    this.examStatus = ExamStatus;
    // this.examStatus = ExamStatus;
    // if (ExamStatus === 0) {
    //   this.filteredExamData = this.QbankExamData;  // Show all exams
    // } else {
    //   this.filteredExamData = this.QbankExamData.map(topic => {
    //     return {
    //       ...topic,
    //       exams: topic.exams.filter(exam => exam.examStatus === ExamStatus)
    //     };
    //   }).filter(topic => topic.exams.length > 0);  // Remove topics with no exams
    // }
  }

  Goback() {
    // Navigation logic here
  }
}

