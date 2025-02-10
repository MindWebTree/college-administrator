import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QbankSubject } from '../QuestionModel';
import { QuestionService } from '../question.service';
import { DataGuardService } from 'app/core/auth/data.guard';
import { ApiErrorHandlerService } from '../../common/api-error-handler.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss'
})
export class ExamListComponent implements OnInit {
  noOfExamCompleted: number = 0;
  subjectId: any;
  QbankExamData: any[] = [];
  filteredExamData: any[] = [];  // to store filtered data
  subjectDetail: QbankSubject[] = [];
  examStatus: number = 0;
  dataLoaded: boolean = false;
  noOfexams: number = 0;

  constructor(
    private _qbankservice: QuestionService,
    private activeRoute: ActivatedRoute,
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
  }

  getsubjectAndQbank(subjectId: number): void {
    this.subjectId = subjectId;
    // this._qbankservice.getQbnkTopicExamList(subjectId).subscribe((res: any) => {
    //   this.QbankExamData = res;
    //   this.filteredExamData = res;  // Initialize with all data
    //   this.dataLoaded=true;
    // }, (error) => {
    //   this._errorHandling.handleError(error);
    // });
  }

  FilterbyExamStatus(ExamStatus: number) {
    this.examStatus = ExamStatus;
    if (ExamStatus === 0) {
      this.filteredExamData = this.QbankExamData;  // Show all exams
    } else {
      this.filteredExamData = this.QbankExamData.map(topic => {
        return {
          ...topic,
          exams: topic.exams.filter(exam => exam.examStatus === ExamStatus)
        };
      }).filter(topic => topic.exams.length > 0);  // Remove topics with no exams
    }
  }

  Goback() {
    // Navigation logic here
  }
}

