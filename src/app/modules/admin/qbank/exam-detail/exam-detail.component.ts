import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ApiErrorHandlerService } from '../../common/api-error-handler.service';
import { DataGuardService } from 'app/core/auth/data.guard';
import { QuestionService } from '../question.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatIconModule],
  templateUrl: './exam-detail.component.html',
  styleUrl: './exam-detail.component.scss'
})
export class ExamDetailComponent implements OnInit, OnDestroy {
  CmbeId: string = "";
  ExamId: any;
  QbnkExamDetails: any;
  courseId: string = '';
  dataLoaded: boolean = false;
  isUserSelectTimer: boolean = false;
  currentTime: Date = new Date();
  examCompleted: boolean = true;
  examUpcoming: boolean = false;
  examInProgress: boolean = false;
  timeLeft: { days: number, hours: number, minutes: number, seconds: number } | null = null;
  timerInterval: any

  constructor(
    private _location: Location,
    private _route: ActivatedRoute,
    private _qbnakservice: QuestionService,
    private errorHandling: ApiErrorHandlerService,
    private _datagurd: DataGuardService,
    private route: Router

  ) {
    // this.courseId = this._datagurd.getCourseId();    
  }

  ngOnInit(): void {
    this._route.params.subscribe(res => {
      this.ExamId = res['guid']
      // this.ExamId = "ca386814-e778-11ef-aad4-40b034f2b31c"
    })
    this._qbnakservice.getExamDetails(this.ExamId).subscribe((res: any) => {
      if (res) {
        this.dataLoaded = true;
        this.QbnkExamDetails = res;
        this.isUserSelectTimer = this.QbnkExamDetails.isTimerEnabled;
        const examStartDate = new Date(res.examDate);
        const examEndDate = new Date(res.examEndDate);
        this.determineExamStatus(examStartDate, examEndDate);
        // if (examEndDate > this.currentTime) {
        //   this.examCompleted = false;
        //   if (this.currentTime < examStartDate) {
        //     this.examUpcoming = true
        //   }
        //   else if (this.currentTime < examEndDate) {
        //     this.examInProgress = true
        //     console.log("examinprogress")
        //   }
        // }
      }

    }, (error) => {
      if (error) {
        this.dataLoaded = false;
        this.route.navigate(['']);
      }
      this.errorHandling.handleError(error)
    });

  }
  private determineExamStatus(examStartDate: Date, examEndDate: Date): void {
    const currentTime = new Date();

    if (currentTime < examStartDate) {
      this.examUpcoming = true;
      this.examInProgress = false;
      this.examCompleted = false;
      this.startUpcomingExamTimer(examStartDate);
    } else if (currentTime >= examStartDate && currentTime <= examEndDate) {
      this.examUpcoming = false;
      this.examInProgress = true;
      this.examCompleted = false;
    } else {
      this.examUpcoming = false;
      this.examInProgress = false;
      this.examCompleted = true;
    }
  }
  startUpcomingExamTimer(examStartDate: Date): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      const currentTime = new Date();
      const timeDiff = examStartDate.getTime() - currentTime.getTime();

      if (timeDiff <= 0) {
        // Exam has started, clear interval and update status
        clearInterval(this.timerInterval);
        this.determineExamStatus(examStartDate, new Date(this.QbnkExamDetails.examEndDate));
        return;
      }

      // Calculate time components
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      this.timeLeft = { days, hours, minutes, seconds };
    }, 1000);
  }
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  Settimer(isChecked: boolean): void {
    this.isUserSelectTimer = isChecked;
    console.log(this.isUserSelectTimer);
  }
  naviGateToExam() {
    if (this.QbnkExamDetails && this.QbnkExamDetails.questionDuration > 0) {
      this.route.navigate(['/qbank/game-view/', this.ExamId],
        {
          queryParams: {
            time: this.isUserSelectTimer
          }
        })
    } else {
      this.route.navigate(['/qbank/game-view/', this.ExamId]);
    }

  }
  goToQanks() {
    this._location.back();
  }
}
